import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import TimelineCalendar from "@/components/TimelineCalendar";
import { SignOutButton } from "@/components/SignOutButton";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold text-slate-900">Timelinex</h1>
            </div>
            
            {session && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-blue-100">
                    <img
                      src={session.user?.image || "/default-avatar.png"}
                      alt="User avatar"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-700 hidden sm:block">
                    {session.user?.name}
                  </span>
                </div>
                <SignOutButton />
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="relative">
        {!session ? (
          <>
            {/* Hero Section */}
            <section className="relative py-20 sm:py-32">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6">
                    Master Your
                    <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Timeline
                    </span>
                  </h1>
                  <p className="text-xl sm:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                    The intelligent calendar and task management platform that helps you organize your life, 
                    track your progress, and achieve your goals with precision.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <form action="/api/auth/signin/google" method="POST">
                      <button
                        type="submit"
                        className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          <span>Continue with Google</span>
                        </div>
                      </button>
                    </form>
                    <div className="text-sm text-slate-500">
                      Free forever • No credit card required
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Background Elements */}
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-20"></div>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                    Everything you need to stay organized
                  </h2>
                  <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Powerful features designed to help you manage time, track progress, and achieve your goals.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                  <div className="group hover:scale-105 transition-transform duration-300">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Calendar</h3>
                      <p className="text-slate-600 leading-relaxed">
                        Intelligent scheduling with timeline view, drag-and-drop functionality, and seamless Google Calendar integration.
                      </p>
                    </div>
                  </div>

                  <div className="group hover:scale-105 transition-transform duration-300">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">Task Management</h3>
                      <p className="text-slate-600 leading-relaxed">
                        Advanced task tracking with priorities, deadlines, progress indicators, and powerful collaboration tools.
                      </p>
                    </div>
                  </div>

                  <div className="group hover:scale-105 transition-transform duration-300">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-6">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">Lightning Fast</h3>
                      <p className="text-slate-600 leading-relaxed">
                        Built for speed with instant sync, real-time updates, and optimized performance across all devices.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                  Ready to transform your productivity?
                </h2>
                <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                  Join thousands of professionals who have revolutionized their workflow with Timeline.
                </p>
                <form action="/api/auth/signin/google" method="POST">
                  <button
                    type="submit"
                    className="bg-white hover:bg-gray-50 text-blue-600 font-bold py-4 px-8 rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Get Started Free
                  </button>
                </form>
              </div>
            </section>
          </>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-100">
                      <img
                        src={session.user?.image || "/default-avatar.png"}
                        alt="User avatar"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">
                        Welcome back, {session.user?.name?.split(' ')[0]}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {new Date().toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center space-x-6 text-sm text-slate-500">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>All systems operational</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <TimelineCalendar session={session} />
          </div>
        )}
      </main>
    </div>
  );
}