import React, {useEffect} from 'react';
import {
    Form,
    InputNumber,
} from 'antd';
import {
    PicCenterOutlined,
} from '@ant-design/icons';
import RadioGroup from '../radio-group';
import UnitInput from '../unit-input';
import './style.less';

const displayOptions = [
    {value: 'inline', label: '内联布局', icon: <PicCenterOutlined/>},
    {value: 'flex', label: '弹性布局', icon: <PicCenterOutlined/>},
    {value: 'block', label: '块级布局', icon: <PicCenterOutlined/>},
    {value: 'inline-block', label: '内联块布局', icon: <PicCenterOutlined/>},
    {value: 'none', label: '内联块布局', icon: <PicCenterOutlined/>},
];

const flexDirectionOptions = [
    {value: 'row', label: '水平', tip: '水平方向，起点在左端'},
    {value: 'row-reverse', label: '逆水平', tip: '水平方向，起点在右端'},
    {value: 'column', label: '垂直', tip: '垂直方向，起点在上端'},
    {value: 'column-reverse', label: '逆垂直', tip: '垂直方向，起点在下端'},
];

const justifyContentOptions = [
    {value: 'flex-start', label: '左对齐', icon: <PicCenterOutlined/>},
    {value: 'flex-end', label: '右对齐', icon: <PicCenterOutlined/>},
    {value: 'center', label: '居中', icon: <PicCenterOutlined/>},
    {value: 'space-between', label: '两端对齐', icon: <PicCenterOutlined/>},
    {value: 'space-around', label: '横向平分', icon: <PicCenterOutlined/>},
];
const alignItemsOptions = [
    {value: 'flex-start', label: '上对齐', icon: <PicCenterOutlined/>},
    {value: 'flex-end', label: '下对齐', icon: <PicCenterOutlined/>},
    {value: 'center', label: '居中', icon: <PicCenterOutlined/>},
    {value: 'baseline', label: '基线对齐', icon: <PicCenterOutlined/>},
    {value: 'stretch', label: '沾满容器', icon: <PicCenterOutlined/>},
];
const flexWrapOptions = [
    {value: 'nowrap', label: '不换行'},
    {value: 'wrap', label: '正换行'},
    {value: 'wrap-reserve', label: '逆换行'},
];
const paddingMarginFields = [
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
];

export default function Layout(props) {
    const {value, onChange = () => undefined} = props;
    const [form] = Form.useForm();

    function handleChange(changedValues, allValues) {
        console.log('values', allValues);
        // TODO paddingTop 等 去空格 、'100' => 100 纯数字，转数字
        onChange(allValues);
    }

    useEffect(() => {
        // 先重置，否则会有字段不清空情况
        form.resetFields();
        form.setFieldsValue(value);
    }, [value]);
    return (
        <div styleName="root">
            <Form
                form={form}
                onValuesChange={handleChange}
                name="layout"
            >

                <Form.Item
                    label="布局模式"
                    name="display"
                    colon={false}
                >
                    <RadioGroup options={displayOptions}/>
                </Form.Item>
                <Form.Item shouldUpdate noStyle>
                    {({getFieldValue}) => {
                        const display = getFieldValue('display');
                        if (display !== 'flex') return null;

                        return (
                            <>
                                <Form.Item
                                    label="主轴方向"
                                    name="flexDirection"
                                    colon={false}
                                >
                                    <RadioGroup options={flexDirectionOptions}/>
                                </Form.Item>
                                <Form.Item
                                    label="主轴对齐"
                                    name="justifyContent"
                                    colon={false}
                                >
                                    <RadioGroup options={justifyContentOptions}/>
                                </Form.Item>
                                <Form.Item
                                    label="辅轴对齐"
                                    name="alignItems"
                                    colon={false}
                                >
                                    <RadioGroup options={alignItemsOptions}/>
                                </Form.Item>
                                <Form.Item
                                    label="换行方式"
                                    name="flexWrap"
                                    colon={false}
                                >
                                    <RadioGroup options={flexWrapOptions}/>
                                </Form.Item>
                                <Form.Item
                                    label="放大比例"
                                    name="flexGrow"
                                    colon={false}
                                >
                                    <InputNumber style={{width: '100%'}} placeholder="请输入" min={0} step={1}/>
                                </Form.Item>
                                <Form.Item
                                    label="缩小比例"
                                    name="flexShrink"
                                    colon={false}
                                >
                                    <InputNumber style={{width: '100%'}} placeholder="请输入" min={0} step={1}/>
                                </Form.Item>
                                <Form.Item
                                    label="基础空间"
                                    name="flexBasis"
                                    colon={false}
                                >
                                    <UnitInput/>
                                </Form.Item>
                            </>
                        );
                    }}
                </Form.Item>
                <div style={{padding: '0 5px'}}>
                    <div styleName="contentBox">
                        {paddingMarginFields.map(item => (
                            <div styleName={`paddingMargin ${item}`}>

                                <Form.Item
                                    name={item}
                                    noStyle
                                    colon={false}
                                >
                                    <UnitInput allowClear={false} placeholder={''}/>
                                </Form.Item>
                            </div>
                        ))}

                        <div styleName="widthHeight">

                            <Form.Item
                                label="宽"
                                name="width"
                                colon={false}
                            >
                                <UnitInput style={{width: 80, marginRight: 8}}/>
                            </Form.Item>
                            <Form.Item
                                label="高"
                                name="height"
                                colon={false}
                            >
                                <UnitInput style={{width: 80}}/>
                            </Form.Item>
                        </div>
                    </div>
                </div>
            </Form>
        </div>
    );
}
