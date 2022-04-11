import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Upload, message, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import '../../styles/SpineContent.less';

const { Dragger } = Upload;


export class UploadComponent extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      fileList: [], //文件列表，用于控制upload组件
    };
    this.handleUpload = this.handleUpload.bind(this)
  }



  handleFileChange = ({ file, fileList }) => {
    //处理文件change，保证用户选择的文件只有一个
    const { status } = file;
    if(file.size/1024/1024>50){
      message.error(`${file.name} has exceeded 50 MB.`)
      return;
    }
    this.setState({
      fileList
    })
  };

  handleUpload() {
    if (!this.state.fileList.length) {
      message.warning('请选择要上传的文件');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.state.fileList[0].originFileObj);

    this.props.actions.uploadFile(formData, this.props.type === "conan");
  };

  render() {
    return (
      <div>
        <Dragger
          name="file"
          multiple={false}
          action=""
          beforeUpload={(f, fList) => fList.length>1?true:false}
          onChange={this.handleFileChange}
          accept=".csv, .xls, .xlsx"

        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Supported file format: csv, excel. File size cannot exceed 50MB.
          </p>
        </Dragger>
        <Button
          type="primary"
          onClick={this.handleUpload}
          disabled={this.state.fileList.length !== 1}
          loading={this.props.home.isUploading}
          size="large"
          style={{ marginTop: 16, marginLeft: "47%"
 }}
        >
          {this.props.home.isUploading ? 'Uploading' : 'Start Upload'}
        </Button>
        
      </div>
    );
  }

  // render() {
  //   const fileList = this.state.fileList;
  //   const uploading = this.state.uploading;
  //   return (
  //     <div>
  //       <Upload
  //         fileList={this.state.fileList}
  //         beforeUpload={(f, fList) => false}
  //         onChange={this.handleFileChange}
  //       >
  //         <Button>
  //           <CloudUploadOutlined /> 选择文件
  //         </Button>
  //       </Upload>
  //       <Button
  //         type="primary"
  //         onClick={this.handleUpload}
  //         disabled={fileList.length === 0}
  //         loading={uploading}
  //         style={{ marginTop: 16 }}
  //       >
  //         {uploading ? 'Uploading' : 'Start Upload'}
  //       </Button>
  //     </div>
  //   );
  // }
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
)(UploadComponent);
