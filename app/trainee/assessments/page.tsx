import Link from "next/link";

export default function Assignment() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Main content */}
        <div className="flex-1">
          <div className="p-4">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h1 className="mb-4 text-2xl font-bold text-gray-800">
                Assignments
              </h1>

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
                  Check back soon for new assignments. When assignments are
                  available, they will appear in this section.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
