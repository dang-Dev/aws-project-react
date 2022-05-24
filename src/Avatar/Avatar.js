import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Typography } from '@mui/material';

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

export default function  AvatarCard(props) {
  const {firstName, lastName, neckName, handleClose, isInCommentCard} = props
  const fullName = String(firstName) + " " + String(lastName);
  return (
        <>
        {isInCommentCard ? (
          <CardHeader sx={{ p:1.5, textAlign: "left", fontSize: "10px",  boxShadow: "none"}}
        avatar={
            <Avatar {...stringAvatar(firstName ? fullName : "No Data!")} />
        }
        action={
          <IconButton aria-label="close" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        }
        title = {<Typography sx={{fontWeight: "550", fontSize: "14px"}}>{fullName}</Typography>}
        subheader={neckName ? neckName: ""}
      />
        ): (
          <CardHeader sx={{ p:1.5, textAlign: "left", fontSize: "10px",  boxShadow: "none"}}
        avatar={
            <Avatar {...stringAvatar(firstName ? fullName : "No Data!")} />
        }
        title = {<Typography sx={{fontWeight: "550", fontSize: "14px"}}>{fullName}</Typography>}
        subheader={neckName ? neckName: ""}
      />
        )}
        </>
  );
}
