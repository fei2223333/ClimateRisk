import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Line, Column } from '@ant-design/charts';
import { Row, Col, Space, Card, Divider, Table, PageHeader } from 'antd';
import '../../styles/TemplateChart.less';

export class ConanContent extends Component {
  render() {
    let data;
    if (this.props.data) {
      data = [...this.props.data.list];
      data.sort((a, b) => {
        return b.score - a.score;
      });
      data = data.map((t, index) => {
        return {
          rank: index+1,
          rootCause: t.cluster + t.version,
          score: t.score,
        };
      });
    }

    const columns = [
      {
        title: 'Rank',
        dataIndex: 'rank',
        key: 'rank',
      },
      {
        title: 'Root Cause Combination',
        dataIndex: 'rootCause',
        key: 'rootCause',
      },
      {
        title: 'Score',
        dataIndex: 'score',
        key: 'score',
      },
    ];

    return this.props.data ? (
      <Space direction="vertical" size="middle" style={{ display: 'flex', marginTop: 30 }}>
        <Card title="Diagnosis Results">
          <Table columns={columns} dataSource={this.props.data.list.map((d,i)=>{return {...d,key:i}})} />
        </Card>
      </Space>
    ) : null;
  }
}

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
)(ConanContent);
