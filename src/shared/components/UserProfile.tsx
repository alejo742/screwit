import { User } from "@/features/users/types/user";
import Image from "next/image";
import { ROUTES, defaultProfilePicture } from "../constants";
import { useRouter } from "next/navigation";

interface UserProfileProps {
  user: User;
}
export default function UserProfile({user}: UserProfileProps) {
  const router = useRouter();

  function handleUserProfileClick() {
    router.push(ROUTES.DASHBOARD);
  }

  return (
    <div className="rounded-full cursor-pointer hover:opacity-80 transition-opacity">
      <Image 
        src={user.profilePicture || defaultProfilePicture} 
        alt="Profile"
        width={30}
        height={30}
        className="object-cover rounded-full"
        onClick={handleUserProfileClick}
      />
      {/* TODO: perhaps a dropdown on clicking the profile pic instead of just dashboard */}
    </div>
  )
}