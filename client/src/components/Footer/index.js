import React from 'react';
import './style.css';
import { SvgIcon } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
  return (
    <div className='footer'>
      <a
        href='https://github.com/cshepscorp/reading-rambo'
        rel='noreferrer'
        target='_blank'
      >
        <SvgIcon alt='github-icon' fontSize='large' component={GitHubIcon} />
      </a>
    </div>
  );
};

export default Footer;
