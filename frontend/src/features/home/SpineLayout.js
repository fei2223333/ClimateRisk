import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import 'antd/dist/antd.css';
import TemplateChart from './TemplateChart';
import UploadComponent from './UploadComponent';


export class SpineLayout extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount(){
    this.props.actions.switchHeader({
      title:"Spine",
      subtitle:"An automated and scalable log parser"
    })
  }

  componentWillUnmount(){
    this.props.actions.resetUpload();
  }

  render() {
    return (
      <div className="home-spine-layout">
              <UploadComponent type="spine"></UploadComponent>
              <TemplateChart  data={this.props.home.parsedData} />
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    home: state.home,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SpineLayout);
