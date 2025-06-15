'use client'

import { useAppSelector } from '@/redux/hooks';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';



const Sidebar = () => {
  const user = useAppSelector(state => state.user.user);
  const pathname = usePathname();

  return (
    <div className="flex flex-col items-center justify-between h-full text-white py-4">
      {/* Logo at the top */}
      <Link href={'/'} className="flex items-center">
        <Image src='/logo.png' alt="ChatGPT Logo" width={35} height={35} className='rounded-lg'/>
      </Link>
      
     
    </div>
  );
};

export default Sidebar;