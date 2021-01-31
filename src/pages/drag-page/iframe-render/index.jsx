import React, {useCallback, useRef, useEffect} from 'react';
import ReactDOM from 'react-dom';
import config from 'src/commons/config-hoc';
import Element from './Element';
import {scrollElement} from 'src/pages/drag-page/util';
import KeyMap from 'src/pages/drag-page/KeyMap';

const iframeSrcDoc = `
<!DOCTYPE html>
<html lang="en">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=0.5, maximum-scale=2.0, user-scalable=yes" />
    <body style="scroll-behavior: smooth;">
        <div id="dnd-container"></div>
        <div id="drop-guide-line" style="display: none"><span>前</span></div>
    </body>
</html>
`;

export default config({
    side: false,
    connect: state => {
        return {
            pageConfig: state.dragPage.pageConfig,
            activeToolKey: state.dragPage.activeToolKey,
            selectedNodeId: state.dragPage.selectedNodeId,
            activeSideKey: state.dragPage.activeSideKey,
            draggingNode: state.dragPage.draggingNode,
            dragPage: state.dragPage,
        };
    },
})(function IframeRender(props) {
    const {
        dragPage,
        pageConfig,
        activeToolKey,
        selectedNodeId,
        activeSideKey,
        draggingNode,
    } = props;
    const dragPageAction = props.action.dragPage;

    const iframeRef = useRef(null);
    const iframeRootRef = useRef(null);

    // 渲染设计页面
    function renderDesignPage() {
        const iframeDocument = iframeRef.current.contentDocument;
        const iframeRootEle = iframeRootRef.current;
        if (!iframeRootEle) return;

        ReactDOM.render(
            <Element
                config={pageConfig}
                dragPage={dragPage}
                dragPageAction={dragPageAction}
                iframeDocument={iframeDocument}
            />,
            iframeRootEle,
        );

    }

    // iframe 加载完成后一些初始化工作
    const handleIframeLoad = useCallback(() => {
        const iframeDocument = iframeRef.current.contentDocument;
        const head = document.head.cloneNode(true);
        iframeDocument.head.remove();
        iframeDocument.documentElement.insertBefore(head, iframeDocument.body);

        iframeDocument.body.style.overflow = 'auto';

        iframeRootRef.current = iframeDocument.getElementById('dnd-container');

        renderDesignPage();

    }, [iframeRef.current]);

    // 相关数据改变之后，重新渲染设计页面
    useEffect(() => {
        renderDesignPage();
    }, [
        pageConfig,
        activeToolKey,
        selectedNodeId,
        activeSideKey,
        draggingNode,
    ]);


    // 选中组件之后，调整左侧组件树滚动
    useEffect(() => {
        const containerEle = iframeRef.current.contentDocument.body;

        if (!containerEle) return;

        // 等待树展开
        setTimeout(() => {
            const element = containerEle.querySelector(`[data-componentid="${selectedNodeId}"]`);

            scrollElement(containerEle, element);
        }, 200);

    }, [selectedNodeId, iframeRef.current]);

    return (
        <>
            <KeyMap iframe={iframeRef.current}/>
            <iframe
                id="dnd-iframe"
                title="dnd-iframe"
                ref={iframeRef}
                style={{border: 0, width: '100%', height: '100%'}}
                srcDoc={iframeSrcDoc}
                onLoad={() => handleIframeLoad()}
            />
        </>
    );
});
