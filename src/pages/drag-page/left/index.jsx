import React, {useRef} from 'react';
import {Tooltip} from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ShareAltOutlined,
    AppstoreOutlined,
    DesktopOutlined,
} from '@ant-design/icons';
import {useHeight} from 'ra-lib';
import config from 'src/commons/config-hoc';
import ComponentTree from '../component-tree';
import ComponentStore from '../component-store';
import SchemaEditor from '../schema-editor';
import CanvasSetting from '../canvas-setting';
import {OTHER_HEIGHT} from 'src/pages/drag-page/util';
import './style.less';
import DragBar from 'src/pages/drag-page/drag-bar';

export default config({
    connect: state => {
        return {
            showSide: state.dragPage.showSide,
            sideWidth: state.dragPage.sideWidth,
            activeSideKey: state.dragPage.activeSideKey,
        };
    },
})(function Left(props) {
    const {
        showSide,
        sideWidth,
        activeSideKey,
        action: {dragPage: dragPageAction},
    } = props;
    const rightRef = useRef(null);
    const [height] = useHeight(rightRef, OTHER_HEIGHT);

    function handleToolClick(key) {
        if (key === activeSideKey) {
            dragPageAction.showSide(!showSide);
            return;
        }
        dragPageAction.setActiveSideKey(key);
        dragPageAction.showSide(true);
    }

    function handleToggle() {
        const nextShowSide = !showSide;

        if (nextShowSide && !activeSideKey) {
            dragPageAction.setActiveSideKey('componentStore');
        }

        dragPageAction.showSide(nextShowSide);
    }

    function handleDragging(info) {
        const {clientX} = info;

        const {x} = rightRef.current.getBoundingClientRect();
        dragPageAction.setSideWidth(clientX - x - 4);
    }

    const tools = [
        {
            title: '组件树',
            key: 'componentTree',
            icon: <ShareAltOutlined/>,
            component: <ComponentTree/>,
        },
        {
            title: '组件库',
            key: 'componentStore',
            icon: <AppstoreOutlined/>,
            component: <ComponentStore/>,
        },
        {
            title: '画布设置',
            key: 'canvasSetting',
            icon: <DesktopOutlined/>,
            component: <CanvasSetting/>,
            bottom: true,
        },
        {
            title: 'Schema 源码开发',
            key: 'schemaEditor',
            icon: <DesktopOutlined/>,
            component: <SchemaEditor/>,
            bottom: true,
        },
    ];

    function renderTools(tools, bottom) {
        return tools.filter(item => item.bottom === bottom).map(item => {
            const {title, key, icon} = item;
            const active = showSide && key === activeSideKey;

            return (
                <Tooltip placement="right" title={title}>
                    <div styleName={`toolItem ${active ? 'active' : ''}`} onClick={() => handleToolClick(key)}>
                        {icon}
                    </div>
                </Tooltip>
            );
        });
    }

    const rightWidth = showSide ? sideWidth : 0;
    return (
        <div
            styleName="root"
        >
            {showSide ? <DragBar onDragging={handleDragging}/> : null}
            <div styleName="left">
                <div styleName="leftTop">
                    <Tooltip placement="right" title={showSide ? '收起' : '展开'}>
                        <div styleName="toggle toolItem" onClick={() => handleToggle()}>
                            {showSide ? <MenuFoldOutlined/> : <MenuUnfoldOutlined/>}
                        </div>
                    </Tooltip>
                    {renderTools(tools)}
                </div>
                <div styleName="leftBottom">
                    {renderTools(tools, true)}
                </div>
            </div>
            <div styleName="right" ref={rightRef} style={{height, width: rightWidth}}>
                {tools.map(item => {
                    const {key, component} = item;
                    return (
                        <div
                            id={key}
                            style={{
                                display: showSide && key === activeSideKey ? 'flex' : 'none',
                                height: '100%',
                                width: '100%',
                            }}
                        >
                            {component}
                        </div>
                    );
                })}
            </div>
        </div>
    );
});
