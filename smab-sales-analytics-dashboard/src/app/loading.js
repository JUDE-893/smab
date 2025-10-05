import { Loader } from "lucide-react"

// app/loading.js
export default function Loading() {

    return <div className='bg-background absolute z-10 h-screen'><div className=" flex justify-center items-center relative w-screen h-screen"><Loader size={80} className=" absolute animate-spin text-destructive" /></div></div>

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      <span className="ml-3 text-lg font-medium text-gray-600">
        Loading...
      </span>
    </div>
  );
}
