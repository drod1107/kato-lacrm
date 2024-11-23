// src/app/page.tsx
import { UserButton } from "@clerk/nextjs";
import FolderView from "@/components/FolderView";

export default function Home() {
 return (
   <main className="min-h-screen bg-gray-50">
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       {/* Header */}
       <div className="py-6">
         <div className="flex justify-between items-center">
           <h1 className="text-3xl font-bold text-gray-900">KATO LACRM Manager</h1>
           <UserButton 
             appearance={{
               elements: {
                 avatarBox: "h-10 w-10"
               }
             }} 
           />
         </div>
         
         {/* Optional Subheader/Description */}
         <p className="mt-2 text-sm text-gray-600">
           Manage Google Drive files and LACRM integration
         </p>
       </div>

       {/* Main Content */}
       <div className="py-8">
         <FolderView />
       </div>
     </div>
   </main>
 );
}