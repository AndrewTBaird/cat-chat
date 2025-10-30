import { UserCircle } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getChannels } from '@/lib/api'

export const TopNav = () => {
  const navigate = useNavigate();
  const { channelId } = useParams<{ channelId: string }>();
  const [channels, setChannels] = useState<Array<{ id: number; name: string }>>([])

  useEffect(() => {
    getChannels()
      .then((data) => {
        setChannels(data.channels)
      })
      .catch((error) => {
        console.error('Failed to fetch channels:', error)
      })
  }, [])

  const currentChannel = channels.find(channel => channel.id === parseInt(channelId || '1'))
  const channelName = currentChannel?.name || 'Loading...'

  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-1">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-lg">{channelName}</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 hover:bg-accent rounded-md p-2">
            <UserCircle className="w-6 h-6" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
            Edit Profile
          </DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
