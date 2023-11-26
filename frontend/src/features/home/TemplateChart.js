import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Line, Column } from '@ant-design/charts';
import { Row, Col, Space, Card, Divider,Table ,Button} from 'antd';
import '../../styles/TemplateChart.less';
import { Pie } from '@antv/g2plot';

export class TemplateChart extends Component {
  constructor(props){
    super(props)
    this.downloadFile = this.downloadFile.bind(this);
  }
  state = {
    statistics: [],
  };

  componentWillUnmount(){
    
  }

  downloadFile = (key) => {
    this.props.actions.downloadFile(key);
  }

  componentDidUpdate(prevProps, prevState) {
    // if (this.props.data && this.props.data !== prevProps.data) {
    //   const PRESENTNUM = 20;
    //   let statistics = [];
    //   const data = this.props.data.log_statistics.log_template_mapping;
    //   let keylist = Object.keys(data)
    //   keylist.sort((a,b)=>{
    //     return data[b]-data[a];
    //   })
    //   keylist.forEach(temp => {
    //     const [eventId, template] = temp.split("$$$");
    //     statistics.push({
    //       eventId,
    //       template,
    //       value: data[temp],
    //     });
    //   });
    //   statistics = statistics.slice(0,PRESENTNUM+1);
    //   this.setState({
    //     statistics,
    //   })
    // }
  }

  render() {
    const pieData = this.props.data? {
      Sex_Ratio:this.props.data.Sex_Ratio,
      Age: this.props.data.Age,
      Education: this.props.data.Education,
      Income: this.props.data.Income,
    }: null

    let piePlot = new Pie('container', {
              appendPadding: 10,
              data: [{sex:"rema",ratio:0.5},{sex:"sad",ratio:0.5}],
              angleField: 'ratio',
              colorField: 'sex',
              radius: 0.8,
              label: {
                type: 'outer',
                content: '{name} {percentage}',
              },
              interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
            });
    
    const lineConfig = {
      data: this.state.statistics,
      height: 400,
      xField: 'eventId',
      yField: 'value',
      point: {
        size: 5,
        shape: 'diamond',
      },
      tooltip: {
        fields: ['template', 'value'],
      }
    };

    const columnConfig = {
      data: pieData,
      xField: 'Template id',
      yField: 'Value',
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
        title:"Template ID",
        dataIndex:"EventId",
        key:"EventId",
        defaultSortOrder: 'descend',
        sorter: (a, b) => parseInt(a.EventId.split('E')[1]) - parseInt(b.EventId.split('E')[1]),
      },
      {
        title:"Raw Log",
        dataIndex:"LogMessage",
        key:"LogMessage",
        width:400,
      },
      {
        title:"Log Template",
        dataIndex:"Template",
        key:"Template",
        width:400,
      },
      {
        title:"Parameters",
        dataIndex:"Parameters",
        key:"Parameters",
      },
    ]

    return this.props.data ? (
      
      <Space direction="vertical" size="middle" style={{ display: 'flex',marginTop: 30 }}>
        <span class="header">Parsing Results</span>
        
        <Card title="Log Sample per template">
          <Row>
          {Object.entries(pieData).map(([key, value])=>{
            let colorField;
            Object.entries(value[0]).forEach(([key, value])=>{
              if (key !== 'ratio') {
                  colorField = key;
                }
            })
            // let piePlot = new Pie('container', {
            //   appendPadding: 10,
            //   data: value,
            //   angleField: 'ratio',
            //   colorField,
            //   radius: 0.8,
            //   label: {
            //     type: 'outer',
            //     content: '{name} {percentage}',
            //   },
            //   interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
            // });
            return <Col span={6} push={6}>
              <div class="chart">
                {}
              </div>
            </Col>
          })}
          </Row>
        </Card>
      </Space>
    ) : null
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
