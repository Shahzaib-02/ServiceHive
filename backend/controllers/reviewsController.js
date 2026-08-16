import Booking from '../models/Booking.js'
import Service from '../models/Service.js'

export const getCustomerReviews = async (req, res) => {
  try {
    const userId = req.user._id

    const servicesWithReviews = await Service.find({ 'reviews.userId': userId }).populate('providerId', 'name')

    const reviews = servicesWithReviews.flatMap((service) =>
      service.reviews
        .filter((review) => String(review.userId) === String(userId))
        .map((review) => ({
          id: review._id,
          serviceId: service._id,
          serviceTitle: service.title,
          providerName: service.providerId?.name || 'Provider',
          rating: review.rating,
          comment: review.comment,
          date: review.createdAt?.toISOString().split('T')[0] || '',
        }))
    )

    const pendingBookings = await Booking.find({
      customerId: userId,
      status: 'completed',
      reviewed: { $ne: true }
    })
      .populate('serviceId', 'title')
      .populate('providerId', 'name')
      .sort({ completionDate: -1 })

    const pendingReviews = pendingBookings.map((booking) => ({
      bookingId: booking._id,
      serviceId: booking.serviceId?._id,
      serviceTitle: booking.serviceId?.title || 'Service',
      providerName: booking.providerId?.name || 'Provider',
      completedAt: booking.completionDate ? booking.completionDate.toISOString().split('T')[0] : booking.updatedAt?.toISOString().split('T')[0] || '',
    }))

    res.json({ reviews, pendingReviews })
  } catch (error) {
    console.error('Error fetching customer reviews:', error.message)
    res.status(500).json({ message: 'Unable to fetch reviews' })
  }
}

export const createCustomerReview = async (req, res) => {
  try {
    const userId = req.user._id
    const { serviceId, bookingId, rating, comment } = req.body

    if (!serviceId || !bookingId || !rating || !comment) {
      return res.status(400).json({ message: 'serviceId, bookingId, rating and comment are required' })
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      customerId: userId,
      serviceId,
      status: 'completed',
      reviewed: { $ne: true }
    })

    if (!booking) {
      return res.status(400).json({ message: 'Booking is not eligible for review' })
    }

    const service = await Service.findById(serviceId)
    if (!service) {
      return res.status(404).json({ message: 'Service not found' })
    }

    service.reviews.push({
      userId,
      rating: Number(rating),
      comment: comment.trim(),
    })

    const totalRating = service.reviews.reduce((sum, item) => sum + item.rating, 0)
    service.rating = Math.round((totalRating / service.reviews.length) * 10) / 10

    await service.save()

    booking.reviewed = true
    booking.review = {
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date(),
      serviceId,
    }
    await booking.save()

    res.status(201).json({ message: 'Review submitted successfully' })
  } catch (error) {
    console.error('Error creating customer review:', error.message)
    res.status(500).json({ message: 'Unable to submit review' })
  }
}
