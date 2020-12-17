import React, { Fragment, useEffect } from "react";
import "./App.css";
import "semantic-ui-less/semantic.less";
import HomePage from "../features/home/HomePage";

const App = () => {
  useEffect(() => {
    document.title = "Coronavirus Update (Live)";
  }, []);

  return (
    <Fragment>
      <HomePage />
    </Fragment>
  );
};

export default App;
