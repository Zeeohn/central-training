import Link from "next/link"

export default function Assignment() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed h-full w-16 bg-white shadow-md md:w-64">
          <div className="flex h-16 items-center justify-center border-b">
            <img src="/images/word-sanctuary-logo-black.png" alt="Word Sanctuary" className="h-8 w-auto md:h-10" />
            <span className="ml-2 hidden text-lg font-semibold md:block">Word Sanctuary</span>
          </div>

          <nav className="mt-6">
            <Link href="/select-training" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </div>
              <span className="hidden md:block">Dashboard</span>
            </Link>

            <Link href="/assignment" className="flex items-center px-4 py-3 text-purple-600 bg-purple-100">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-200 text-purple-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <span className="hidden md:block">Assignment</span>
            </Link>

            <Link href="/test-exam" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span className="hidden md:block">Test/Exam</span>
            </Link>

            <Link href="/settings" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <span className="hidden md:block">Settings</span>
            </Link>
          </nav>
        </div>

        {/* Main content */}
        <div className="ml-16 flex-1 md:ml-64">
          <div className="p-4 md:p-8">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h1 className="mb-4 text-2xl font-bold text-gray-800">Assignments</h1>

              <div className="rounded-lg bg-purple-50 p-8 text-center">
                <div className="mb-4 flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-purple-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="mb-2 text-xl font-semibold text-gray-800">
                  Your Assignment Questions Will Be Uploaded Here
                </h2>
                <p className="text-gray-600">
                  Check back soon for new assignments. When assignments are available, they will appear in this section.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
