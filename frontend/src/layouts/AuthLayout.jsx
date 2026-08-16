import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Compass, Menu, Search, Shield, X } from 'lucide-react'
import Button from '../components/ui/Button'
import ParticlesCanvas from '../components/ParticlesCanvas'
import { useAuth } from '../hooks/useAuth'
import ServiceHiveLogo from '../components/brand/ServiceHiveLogo'

const AuthLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user: currentUser, isAuthenticated, logout } = useAuth()

  const navigation = [
    { name: 'Home', href: '/', icon: Compass },
    { name: 'Browse Services', href: '/browse-services', icon: Search },
    { name: 'About', href: '/about', icon: Shield },
  ]

  const dashboardPath = currentUser
    ? currentUser.role === 'provider'
      ? '/provider/dashboard'
      : currentUser.role === 'admin'
        ? '/admin/dashboard'
        : '/customer/dashboard'
    : '/login'

  return (
    <div className="min-h-screen overflow-hidden overflow-x-hidden relative">
      <ParticlesCanvas />
      <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/20 blur-[140px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/20 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="relative z-20 flex justify-center w-full px-4 sm:px-6 lg:px-8">
        <header className="fixed w-full max-w-7xl z-50 border-b border-white/10  bg-transparent lg:bg-yellow-400/10 shadow-none lg:shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <Link to="/" className="flex shrink-0 items-center gap-3 group relative">
              <div className="relative overflow-hidden rounded-xl transition-all duration-300 group-hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative flex h-11 w-11 items-center justify-center">
                  <ServiceHiveLogo className="h-10 w-10 transition-transform duration-300 group-hover:scale-110" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-['Space_Grotesk'] text-xl font-bold text-white transition-all duration-300 group-hover:text-yellow-400 group-hover:scale-105">ServiceHive</h1>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400 transition-all duration-300 group-hover:text-yellow-300">Premium service marketplace</p>
              </div>
            </Link>

            <nav className="order-3 hidden min-w-0 flex-1 basis-full justify-center gap-1 lg:order-none lg:flex lg:basis-auto lg:px-2">
              {navigation.map((item, index) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-0.5 ${
                      isActive
                        ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-400 border border-yellow-400/30 shadow-lg shadow-yellow-400/20'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white hover:shadow-lg'
                    }`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <Icon className="h-4 w-4 shrink-0 transition-all duration-300" />
                    {item.name}
                    <div className="absolute inset-0 rounded-full opacity-0 hover:bg-white/5 transition-all duration-300"></div>
                  </Link>
                )
              })}
            </nav>

            <div className="hidden shrink-0 items-center gap-3 lg:flex">
              {isAuthenticated ? (
                <>
                  <Link to={dashboardPath} className="group">
                    <Button variant="secondary" size="sm" className="transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg">
                      <Compass className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                      Workspace
                    </Button>
                  </Link>
                  <Link to="/browse-services" className="group">
                    <Button size="sm" variant="outline">
                      Book Service
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <div className="relative group">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        logout()
                        navigate('/')
                      }}
                      className="text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                    >
                      <Shield className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="group">
                    <Button variant="outline" size="sm">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/register" className="group">
                    <Button variant="" size="sm" className="bg-transparent text-white border border-white hover:bg-white hover:text-slate-950 hover:-translate-y-0.5">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="group inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-lg lg:hidden"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative transition-transform duration-300">
                  {isMenuOpen ? (
                    <X className="h-5 w-5 text-white transition-all duration-300 group-hover:rotate-90" />
                  ) : (
                    <Menu className="h-5 w-5 text-slate-200 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
                  )}
                </div>
              </div>
            </button>
          </div>

          {isMenuOpen ? (
            <div className="border-t border-white/10 px-4 py-4 lg:hidden">
              <div className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.href

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/6 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  )
                })}
                <div className="grid gap-3 pt-3 sm:grid-cols-2">
                  {isAuthenticated ? (
                    <>
                      <Link to={dashboardPath} onClick={() => setIsMenuOpen(false)}>
                        <Button variant="secondary" className="w-full">
                          Workspace
                        </Button>
                      </Link>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setIsMenuOpen(false)
                          logout()
                          navigate('/')
                        }}
                      >
                        Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" className="w-full">Log in</Button>
                      </Link>
                      <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="secondary" className="w-full">Sign up</Button>
                      </Link>
                    </>
                  )}
                  <Link to="/browse-services" onClick={() => setIsMenuOpen(false)} className="sm:col-span-2">
                    <Button variant="outline">Book now</Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </header>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-32 sm:pt-36 lg:pt-40 pb-12">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
