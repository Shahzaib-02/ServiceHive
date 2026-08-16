
















import mongoose from "mongoose";
import Service from "../models/Service.js";
import { buildServiceImageUrls, parseStoredImage } from "../utils/serviceImageUrls.js";

const toPublicService = (serviceObj, imageCountOverride) => {
  const id = serviceObj._id?.toString?.() || String(serviceObj._id);
  const imageCount =
    imageCountOverride ??
    (Array.isArray(serviceObj.images) ? serviceObj.images.length : 0);

  const { images: _storedImages, ...rest } = serviceObj;

  return {
    ...rest,
    id,
    images: buildServiceImageUrls(id, imageCount),
    hasImages: imageCount > 0,
    imageCount,
    providerName: serviceObj.providerId?.name || "Service Provider",
    providerEmail: serviceObj.providerId?.email || "",
    providerIdStr:
      serviceObj.providerId?._id?.toString?.() ||
      serviceObj.providerId?.toString?.() ||
      "",
  };
};

const resolveImagesForUpdate = (serviceId, incomingImages, storedImages = []) => {
  if (!Array.isArray(incomingImages)) return undefined;

  return incomingImages
    .map((img) => {
      if (typeof img !== "string" || !img.trim()) return null;
      const trimmed = img.trim();

      if (trimmed.startsWith("data:")) return trimmed;

      const match = trimmed.match(/\/api\/services\/([^/]+)\/images\/(\d+)/);
      if (match && match[1] === String(serviceId)) {
        const index = Number.parseInt(match[2], 10);
        return storedImages[index] || null;
      }

      if (/^https?:\/\//i.test(trimmed)) return trimmed;
      return trimmed;
    })
    .filter(Boolean);
};

const buildServiceFilter = (query) => {
  const { search, category, group, providerId, isApproved } = query;
  const filter = {};

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }
  if (category) filter.category = category;
  if (group) filter.group = group;
  if (providerId) {
    filter.providerId = mongoose.isValidObjectId(providerId)
      ? new mongoose.Types.ObjectId(providerId)
      : providerId;
  }
  if (isApproved === "true") filter.isApproved = true;
  if (isApproved === "false") filter.isApproved = false;

  return filter;
};

export const getServices = async (req, res) => {
  try {
    const filter = buildServiceFilter(req.query);

    const services = await Service.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "providerId",
          foreignField: "_id",
          as: "providerDoc",
          pipeline: [{ $project: { name: 1, email: 1, phone: 1 } }],
        },
      },
      {
        $addFields: {
          providerId: { $arrayElemAt: ["$providerDoc", 0] },
          imageCount: { $size: { $ifNull: ["$images", []] } },
        },
      },
      {
        $project: {
          images: 0,
          providerDoc: 0,
        },
      },
    ]);

    const transformedServices = services.map((serviceObj) =>
      toPublicService(serviceObj, serviceObj.imageCount || 0)
    );

    res.json(transformedServices);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

export const getServiceImage = async (req, res) => {
  try {
    const { id, imageIndex } = req.params;
    const index = Number.parseInt(imageIndex, 10);

    if (!mongoose.isValidObjectId(id) || Number.isNaN(index) || index < 0) {
      return res.status(400).json({ message: "Invalid image request" });
    }

    const service = await Service.findById(id).select("images").lean();
    const stored = service?.images?.[index];
    const parsed = parseStoredImage(stored);

    if (!parsed) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.set("Cache-Control", "public, max-age=86400");

    if (parsed.kind === "redirect") {
      return res.redirect(parsed.url);
    }

    res.set("Content-Type", parsed.contentType);
    return res.send(parsed.buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === "undefined" || id === "null") {
      return res.status(400).json({ message: "Invalid service ID" });
    }

    const service = await Service.findById(id).populate(
      "providerId",
      "name email phone"
    );

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const serviceObj = service.toObject();

    if (req.query.rawImages === "true") {
      return res.json({
        ...serviceObj,
        id: serviceObj._id,
        providerName: serviceObj.providerId?.name || "Service Provider",
        providerIdStr: serviceObj.providerId?._id?.toString() || "",
      });
    }

    res.json(toPublicService(serviceObj));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const { title, description, category, basePrice, price, eta, duration, location, images, group } = req.body;
    const providerId = req.user._id;

    // Check if provider already has a service
    const existingService = await Service.findOne({ providerId });
    if (existingService) {
      return res.status(400).json({ 
        message: "You can only create one service as a provider. Please edit your existing service instead." 
      });
    }

    if (!title || !description || !category || !basePrice) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    if (isNaN(Number(basePrice)) || Number(basePrice) <= 0) {
      return res.status(400).json({ message: "Price must be a valid positive number" });
    }

    const serviceData = {
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      group: group || 'home',
      basePrice: Number(basePrice),
      price: Number(price),
      eta: eta || '1 hour',
      duration: duration || '1 hour',
      location: location || 'Client location',
      images: images || [],
      providerId,
      isApproved: false,
    };

    const service = new Service(serviceData);
    const createdService = await service.save();

    const serviceObj = createdService.toObject();
    res.status(201).json(toPublicService(serviceObj));
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.providerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this service" });
    }

    const updateData = { ...req.body };
    delete updateData.providerId;
    delete updateData.createdAt;
    delete updateData._id;

    if (updateData.basePrice !== undefined) {
      if (isNaN(Number(updateData.basePrice)) || Number(updateData.basePrice) <= 0) {
        return res.status(400).json({ message: "Price must be a valid positive number" });
      }
      updateData.basePrice = Number(updateData.basePrice);
    }

    if (updateData.title) updateData.title = updateData.title.trim();
    if (updateData.description) updateData.description = updateData.description.trim();
    if (updateData.category) updateData.category = updateData.category.trim();

    if (updateData.images) {
      updateData.images = resolveImagesForUpdate(
        req.params.id,
        updateData.images,
        service.images || []
      );
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('providerId', 'name email phone');

    const serviceObj = updatedService.toObject();
    res.json(toPublicService(serviceObj));
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.providerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this service" });
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveService = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved, rejectionReason } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const updateData = {
      isApproved,
      status: isApproved ? 'active' : service.status,
      approvalStatus: isApproved ? 'approved' : service.approvalStatus,
      ...((!isApproved && rejectionReason) ? { rejectionReason } : {})
    };

    const updatedService = await Service.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: false }
    ).populate('providerId', 'name email phone');

    const serviceObj = updatedService.toObject();
    res.json({
      ...serviceObj,
      id: serviceObj._id,
      providerName: serviceObj.providerId?.name || 'Service Provider',
      providerIdStr: serviceObj.providerId?._id?.toString() || '',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const rejectService = async (req, res) => {
  try {
    const { id } = req.params;
    const { status = 'rejected', rejectionReason } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const updatedService = await Service.findByIdAndUpdate(
      id,
      { status, isApproved: false, approvalStatus: 'rejected', rejectionReason: rejectionReason || 'Service rejected by admin' },
      { new: true, runValidators: false }
    ).populate('providerId', 'name email phone');

    const serviceObj = updatedService.toObject();
    res.json({
      ...serviceObj,
      id: serviceObj._id,
      providerName: serviceObj.providerId?.name || 'Service Provider',
      providerIdStr: serviceObj.providerId?._id?.toString() || '',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};