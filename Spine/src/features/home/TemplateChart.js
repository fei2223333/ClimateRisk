import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Line, Column } from '@ant-design/charts';
import { Row, Col, Space, Card, Divider,Table } from 'antd';

export class TemplateChart extends Component {
  render() {
    let statistics = [];
    if (this.props.data) {
      const data = this.props.data.log_statistics.log_template_mapping;
      Object.keys(data).forEach(temp => {
        statistics.push({
          template: temp,
          value: data[temp],
        });
      });
    }

    const lineConfig = {
      data: statistics,
      height: 400,
      xField: 'template',
      yField: 'value',
      point: {
        size: 5,
        shape: 'diamond',
      },
    };

    const columnConfig = {
      data: statistics,
      xField: 'template',
      yField: 'value',
      columnWidthRatio: 0.8,
      label: {
        // 可手动配置 label 数据标签位置
        position: 'middle',
        // 'top', 'bottom', 'middle',
        // 配置样式
        style: {
          fill: '#FFFFFF',
          opacity: 0.6,
        },
      },
      xAxis: {
        label: {
          autoHide: true,
          autoRotate: false,
        },
      },
      meta: {
        template: {
          alias: 'Template',
        },
        value: {
          alias: 'Value',
        },
      },
    };

    const columns = [
      {
        title:"Template",
        dataIndex:"template",
        key:"template",
      },
      {
        title:"Raw Log",
        dataIndex:"raw_log",
        key:"raw_log",
      },
      {
        title:"Log Template",
        dataIndex:"log_template",
        key:"log_template",
      },
      {
        title:"Parameters",
        dataIndex:"parameters",
        key:"parameters",
      },
    ]

    return this.props.data ? (
      <Space direction="vertical" size="middle" style={{ display: 'flex',marginTop: 30 }}>
        <Card title="Parsing Results" size="big">
        <Divider orientation="left">Log Statistics</Divider>
          <Row>
            <Col span={18} push={6}>
              <div class="chart">
                {statistics.length > 7 ? <Line {...lineConfig} /> : <Column {...columnConfig} />}
              </div>
            </Col>
            <Col span={6} pull={18}>
              <div>
              
                <p>#Logs:{this.props.data.log_statistics.log_amount}</p>
                <p>#Templates:{this.props.data.log_statistics.template_amount}</p>
              </div>
            </Col>
          </Row>
          <Divider orientation="left">Log Sample per template</Divider>
          <Table columns={columns} dataSource={Object.values(this.props.data.log_sample_results)} />
        </Card>
      </Space>
    ) : null;
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
)(TemplateChart);
