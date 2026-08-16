import logo from '../../images/ServiceHive1.png'

const ServiceHiveLogo = ({ className = 'h-10 w-10', alt = 'ServiceHive logo' }) => (
  <img
    src={logo}
    alt={alt}
    className={`rounded-md object-cover ${className}`}
  />
)

export default ServiceHiveLogo
