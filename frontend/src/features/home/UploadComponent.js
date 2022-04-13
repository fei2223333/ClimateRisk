import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Upload, message, Button, Form, InputNumber, Divider } from 'antd';
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
      iterationSteps: 500,
      iterationStepsValidStatus: 'success',
      iterationStepsErrorMsg: null,
      patternNumber: 10,
      patternNumberValidStatus: 'success',
      patternNumberErrorMsg: null,
      patternLength: 5,
      patternLengthValidStatus: 'success',
      patternLengthErrorMsg: null,
    };
    this.handleUpload = this.handleUpload.bind(this);
  }

  handleFileChange = ({ file, fileList }) => {
    //处理文件change，保证用户选择的文件只有一个
    const { status } = file;
    if (file.size / 1024 / 1024 > 50) {
      message.error(`${file.name} has exceeded 50 MB.`);
      return;
    }
    this.setState({
      fileList,
    });
  };

  handleUpload() {
    if (!this.state.fileList.length) {
      message.warning('请选择要上传的文件');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.state.fileList[0].originFileObj);
    formData.append('iterationSteps', this.state.iterationSteps);
    formData.append('patternNumber', this.state.patternNumber);
    formData.append('patternLength', this.state.patternLength);

    this.props.actions.uploadFile(formData, this.props.type === 'conan');
  }

  validatePatternNumber = number => {
    const MIN = 1;
    const MAX = 30;
    if (typeof number === 'number' && number >= MIN && number <= MAX) {
      return {
        patternNumberValidStatus: 'success',
        patternNumberErrorMsg: null,
      };
    }

    return {
      patternNumberValidStatus: 'error',
      patternNumberErrorMsg: 'Please input a number between 1 to 30',
    };
  };

  validatePatternLength = length => {
    const MIN = 1;
    const MAX = 8;
    if (typeof length === 'number' && length >= MIN && length <= MAX) {
      return {
        patternLengthValidStatus: 'success',
        patternLengthErrorMsg: null,
      };
    }

    return {
      patternLengthValidStatus: 'error',
      patternLengthErrorMsg: 'Please input a length between 1 to 8',
    };
  };

  validateIterationSteps = number => {
    const MIN = 1;
    const MAX = 2000;
    if (typeof number === 'number' && number >= MIN && number <= MAX) {
      return {
        iterationStepsValidStatus: 'success',
        iterationStepsErrorMsg: null,
      };
    }

    return {
      iterationStepsValidStatus: 'error',
      iterationStepsErrorMsg: 'Please input a number between 1 to 30',
    };
  };

  onPatternNumberChange = patternNumber => {
    this.setState({
      ...this.validatePatternNumber(patternNumber),
      patternNumber,
    });
  };

  onPatternLengthChange = patternLength => {
    this.setState({
      ...this.validatePatternLength(patternLength),
      patternLength,
    });
  };

  onIterationStepsChange = iterationSteps => {
    this.setState({
      ...this.validateIterationSteps(iterationSteps),
      iterationSteps,
    });
  };

  render() {
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 12 },
    };
    return (
      <div>
        <Form>
          <Dragger
            name="file"
            multiple={false}
            action=""
            beforeUpload={(f, fList) => (fList.length > 1 ? true : false)}
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
          <Divider />
          <Form.Item
            {...formItemLayout}
            label="Iteration Steps"
            validateStatus={this.state.iterationStepsValidStatus}
            help={this.state.iterationStepsErrorMsg}
          >
            <InputNumber
              style={{ width: '50%' }}
              min={500}
              defaultValue={500}
              step={50}
              value={this.state.iterationSteps}
              onChange={this.onIterationStepsChange}
            />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="Max Pattern Number"
            validateStatus={this.state.patternNumberValidStatus}
            help={this.state.patternNumberErrorMsg}
          >
            <InputNumber
              style={{ width: '50%' }}
              min={1}
              defaultValue={10}
              value={this.state.patternNumber}
              onChange={this.onPatternNumberChange}
            />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="Max Pattern Length"
            validateStatus={this.state.patternLengthValidStatus}
            help={this.state.patternLengthErrorMsg}
          >
            <InputNumber
              style={{ width: '50%' }}
              min={1}
              defaultValue={5}
              value={this.state.patternLength}
              onChange={this.onPatternLengthChange}
            />
          </Form.Item>
          <Button
            type="primary"
            onClick={this.handleUpload}
            disabled={
              this.state.fileList.length !== 1 ||
              this.state.iterationStepsValidStatus === 'error' ||
              this.state.patternLengthValidStatus === 'error' ||
              this.state.patternNumberValidStatus === 'error'
            }
            loading={this.props.home.isUploading}
            size="large"
            style={{ marginTop: 16, marginLeft: '47%' }}
          >
            {this.props.home.isUploading ? 'Uploading' : 'Start Upload'}
          </Button>
        </Form>
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
)(UploadComponent);
