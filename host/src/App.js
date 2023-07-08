import React from 'react';
// import addDays from 'date-fns/addDays';
// import addDam from 'date-fns/addMinutes';
// import add2Dam from 'date-fns/addHours';

import Badge from '@mui/material/Badge';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
import loadable from '@loadable/component'
// import Dialog from '@mui/material/Dialog';

const LoadableComponent = loadable(() => import('./loadable-component'))

// const LoadableComponent = React.lazy(() => import('./loadable-component'));


function loadComponent(scope, module) {
  return async () => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__('default');
    const container = window[scope]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__.default);
    const factory = await window[scope].get(module);
    const Module = factory();
    return Module;
  };
}

const urlCache = new Set();
const useDynamicScript = url => {
  const [ready, setReady] = React.useState(false);
  const [errorLoading, setErrorLoading] = React.useState(false);

  React.useEffect(() => {
    if (!url) return;

    if (urlCache.has(url)) {
      setReady(true);
      setErrorLoading(false);
      return;
    }

    setReady(false);
    setErrorLoading(false);

    const element = document.createElement('script');

    element.src = url;
    element.type = 'text/javascript';
    element.async = true;

    element.onload = () => {
      urlCache.add(url);
      setReady(true);
    };

    element.onerror = () => {
      setReady(false);
      setErrorLoading(true);
    };

    document.head.appendChild(element);

    return () => {
      urlCache.delete(url);
      document.head.removeChild(element);
    };
  }, [url]);

  return {
    errorLoading,
    ready,
  };
};

// const PENSION_ENTRY = {
//   url: 'http://localhost:8080/assets/remoteEntry.js',
//   scope: 'newclick_transfers_ui',
//   module: './desktop',
// }

const componentCache = new Map();
export const useFederatedComponent = (remoteUrl, scope, module) => {
  const key = `${remoteUrl}-${scope}-${module}`;
  const [Component, setComponent] = React.useState(null);

  const { ready, errorLoading } = useDynamicScript(remoteUrl);
  React.useEffect(() => {
    if (Component) setComponent(null);
    // Only recalculate when key changes
  }, [key]);

  React.useEffect(() => {
    if (ready && !Component) {
      const Comp = React.lazy(loadComponent(scope, module));
      componentCache.set(key, Comp);
      setComponent(Comp);
    }
    // key includes all dependencies (scope/module)
  }, [Component, ready, key]);

  return { errorLoading, Component };
};

function App() {
  const [{ module, scope, url }, setSystem] = React.useState({});

  const [isOpenDynamic, setIsOpenDynamic] = React.useState(false);


  function setApp2Desktop() {
    setSystem({
      url: 'http://localhost:3002/remoteEntry.js',
      scope: 'app2',
      module: './desktop',
    });
  }
  function setApp2Mobile() {
    setSystem({
      url: 'http://localhost:3002/remoteEntry.js',
      scope: 'app2',
      module: './mobile',
    });
  }

  function setApp3() {
    setSystem({
      url: 'http://localhost:3003/remoteEntry.js',
      scope: 'app3',
      module: './Widget',
    });
  }
  function setTransfersAppDesktop() {
    window.appAssetsPath === 'http://localhost:8080/assets/'
    setSystem(PENSION_ENTRY);
  }
  function setTransfersAppMobile() {
    window.appAssetsPath === 'http://localhost:8080/assets/'
    setSystem({
      url: 'http://localhost:8080/assets/remoteEntry.js',
      scope: 'newclick_transfers_ui',
      module: './mobile',
    });
  }

  const { Component: FederatedComponent, errorLoading } = useFederatedComponent(url, scope, module);

  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      }}
    >
      <h1>Dynamic System Host</h1>
      <h2>App 1</h2>
      <p>
        The Dynamic System will take advantage Module Federation <strong>remotes</strong> and{' '}
        <strong>exposes</strong>. It will no load components that have been loaded already.
      </p>
      <button onClick={setApp2Desktop}>Load App 2 Widget desktop</button>
      <button onClick={setApp2Mobile}>Load App 2 Widget mobile</button>
      <button onClick={setApp3}>Load App 3 Widget</button>


      <div>
      <button onClick={setTransfersAppDesktop}>Load transfer desktop</button>
      <button onClick={setTransfersAppMobile}>Load App 3 mobile</button>
      </div>
      <Badge>fafa</Badge>
      {/* <TextField /> */}
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

      <div style={{ marginTop: '2em' }}>
        <React.Suspense fallback="Loading System">
          {errorLoading
            ? `Error loading module "${module}"`
            : FederatedComponent && <FederatedComponent />}
        </React.Suspense>
      </div>

      <button onClick={() => setIsOpenDynamic(true)}>Load loadable</button>
      <React.Suspense fallback={<div>Loading...</div>}>
        {isOpenDynamic && <LoadableComponent />}
      </React.Suspense>
    </div>
  );
}

export default App;
