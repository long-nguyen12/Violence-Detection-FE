import React from "react";
import { connect } from "react-redux";
import Dataset from "../Dataset/index";
import Camera from "../Camera";
import "./TrangChu.scss";

function TrangChu() {
  return (
    <div className="homepage">
      <Camera />
    </div>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}

export default connect(mapStateToProps)(TrangChu);
