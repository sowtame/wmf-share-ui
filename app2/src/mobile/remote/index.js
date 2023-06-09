import React from 'react';

// import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import Dialog from '@mui/material/Dialog';
import {MobileHeader} from './components/Header';

export default function Widget() {
  return (
    <div
      style={{
        borderRadius: '4px',
        padding: '2em',
        backgroundColor: 'red',
        color: 'white',
      }}
      data-e2e="APP_2__WIDGET"
    >
      <MobileHeader />
      <h2>App 2 WidgetMobile</h2>
      {/* <TextField /> */}
      <Button>Button</Button>
      {/* <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={10}
          label="Age"
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select> */}
      <p>
        Moment shouldn't download twice, the host has no moment.js <br />{' '}
      </p>
    </div>
  );
}
