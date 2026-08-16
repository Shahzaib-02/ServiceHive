import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Star, MessageSquare, Filter, Search, Calendar, User,
  ThumbsUp, ThumbsDown, Flag, Edit, Trash2, MoreVertical
} from 'lucide-react'
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const ReviewsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  const ratingOptions = [
    { value: 'all', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '2', label: '2 Stars' },
    { value: '1', label: '1 Star' }
  ]

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'rating-high', label: 'Highest Rating' },
    { value: 'rating-low', label: 'Lowest Rating' }
  ]

  const reviews = [
    {
      id: 1,
      service: 'Home Cleaning Service',
      provider: 'CleanPro Solutions',
      providerAvatar: 'CP',
      rating: 5,
      date: '2024-01-15',
      comment: 'Amazing service! My apartment has never been cleaner. The team was professional, thorough, and arrived right on time. They brought all their own supplies and were very respectful of my space. Will definitely book again!',
      helpful: 12,
      notHelpful: 0,
      response: 'Thank you so much for your wonderful review! We\'re thrilled that you were satisfied with our cleaning service. Looking forward to serving you again!',
      canEdit: true,
      canDelete: true
    },
    {
      id: 2,
      service: 'Plumbing Repair',
      provider: 'QuickFix Plumbing',
      providerAvatar: 'QP',
      rating: 4,
      date: '2024-01-10',
      comment: 'Great experience overall. The plumber was knowledgeable and fixed the issue quickly. Only reason for 4 stars is that they were about 30 minutes late, but they did communicate the delay in advance.',
      helpful: 8,
      notHelpful: 1,
      response: 'We appreciate your feedback and apologize for the delay. We\'re working on improving our punctuality. Glad we could fix your plumbing issue!',
      canEdit: true,
      canDelete: true
    },
    {
      id: 3,
      service: 'Web Development',
      provider: 'TechMasters',
      providerAvatar: 'TM',
      rating: 5,
      date: '2024-01-05',
      comment: 'Outstanding work! The developer understood my requirements perfectly and delivered a high-quality website ahead of schedule. Great communication throughout the project.',
      helpful: 15,
      notHelpful: 0,
      response: 'Thank you for your kind words! It was a pleasure working on your project. Don\'t hesitate to reach out for any future development needs.',
      canEdit: true,
      canDelete: true
    },
    {
      id: 4,
      service: 'Car Detailing',
      provider: 'AutoSpa Premium',
      providerAvatar: 'AP',
      rating: 3,
      date: '2023-12-28',
      comment: 'The service was okay, but I expected more for the price. Some areas were missed and I had to point them out. The staff was friendly though.',
      helpful: 3,
      notHelpful: 2,
      response: 'We\'re sorry we didn\'t meet your expectations. We\'d like to make it right - please contact us to schedule a complimentary touch-up.',
      canEdit: true,
      canDelete: true
    }
  ]

  const pendingReviews = [
    {
      id: 5,
      service: 'Personal Training',
      provider: 'FitLife Coaching',
      providerAvatar: 'FC',
      date: '2024-01-20',
      bookingId: 'BK006',
      canReview: true
    },
    {
      id: 6,
      service: 'Math Tutoring',
      provider: 'EduExperts',
      providerAvatar: 'EE',
      date: '2024-01-18',
      bookingId: 'BK007',
      canReview: true
    }
  ]

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter
    return matchesSearch && matchesRating
  })

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-600'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    )
  }

  const ReviewCard = ({ review }) => (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">{review.providerAvatar}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{review.service}</h3>
              <p className="text-gray-400">{review.provider}</p>
              <div className="flex items-center space-x-2 mt-1">
                {renderStars(review.rating)}
                <span className="text-sm text-gray-400">{review.date}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <p className="text-gray-300 mb-4 leading-relaxed">{review.comment}</p>

        {review.response && (
          <div className="glass-card p-4 rounded-lg mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">PR</span>
              </div>
              <span className="text-sm font-medium text-green-400">Provider Response</span>
            </div>
            <p className="text-gray-300 text-sm">{review.response}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <ThumbsUp className="w-4 h-4 mr-1" />
                Helpful ({review.helpful})
              </Button>
              <Button variant="ghost" size="sm">
                <ThumbsDown className="w-4 h-4 mr-1" />
                Not Helpful ({review.notHelpful})
              </Button>
            </div>
            <Button variant="ghost" size="sm">
              <Flag className="w-4 h-4 mr-1" />
              Report
            </Button>
          </div>
          
          {review.canEdit && (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )

  const PendingReviewCard = ({ review }) => (
    <Card className="border-2 border-dashed border-white/20">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{review.service}</h3>
              <p className="text-gray-400">{review.provider}</p>
              <p className="text-sm text-gray-500 mt-1">Booking #{review.bookingId} • {review.date}</p>
            </div>
          </div>
          
          <Button>
            <Star className="w-4 h-4 mr-2" />
            Write Review
          </Button>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Reviews</h1>
          <p className="text-gray-400">
            Manage your reviews and share feedback about services
          </p>
        </div>
        
        <Button>
          <MessageSquare className="w-4 h-4 mr-2" />
          Write New Review
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Reviews', value: '12', color: 'cyan' },
          { label: 'Average Rating', value: '4.3', color: 'yellow' },
          { label: 'Pending Reviews', value: '2', color: 'orange' },
          { label: 'Helpful Votes', value: '38', color: 'green' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-card p-6 rounded-xl text-center"
          >
            <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
            <div className="text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Pending Reviews */}
      {pendingReviews.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Pending Reviews</h3>
            <div className="space-y-4">
              {pendingReviews.map((review) => (
                <PendingReviewCard key={review.id} review={review} />
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12"
              />
            </div>
            
            <Select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              options={ratingOptions}
            />
            
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={sortOptions}
            />
            
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ReviewCard review={review} />
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No reviews found
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || ratingFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'You haven\'t written any reviews yet'
              }
            </p>
            <Button>
              <MessageSquare className="w-4 h-4 mr-2" />
              Write Your First Review
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ReviewsPage
