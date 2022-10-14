import React, { useEffect, useRef, useState } from 'react';
import { Button, Popconfirm, Tabs } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import Canvas from '@app/common/CanvasCommon/Canvas';
import Loading from '@components/Loading';
import Ratio from '@components/Ratio';

import { CONSTANTS } from '@constants';
import { checkPointInsideObject, cloneObj, genPolygonFromRectangle } from '@app/common/functionCommons';

import './ViewAndDrawImage.scss';

function ViewAndDrawImage({ isLoading, isEditable, imageData, thietBiData, canvasDataset, ...props }) {

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const timer = useRef(null);
  const imageContainerSize = useRef({ width: 0, height: 0 });
  const offsetRange = useRef({ x: 0, y: 0 });

  const image = useRef(null);
  const canvasRef = useRef(null);
  const viewImageSize = useRef({ width: 0, height: 0 });
  const positionOffsetZoom = useRef({ x: 0, y: 0 });
  const mouseOffset = useRef({ x: 0, y: 0 });
  const mounted = useRef(false);
  const draggable = useRef(false);
  const clientOffset = useRef({
    x: undefined,
    y: undefined,
  });

  const canvasState = useRef({
    zoom: 1,
    offset: { x: 0, y: 0 },
    canvasSize: { width: 0, height: 0 },
  });

  const [isLoadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    if (!isLoadingImage) {
      setLoadingImage(true);
    }
    canvasState.current = {
      zoom: 1,
      offset: { x: 0, y: 0 },
      canvasSize: { width: 0, height: 0 },
    };
  }, [props.imageUrl]);

  useEffect(() => {
    mounted.current = true;
    setWidthHeightCanvas();

    window.addEventListener('resize', setWidthHeightCanvas);
    window.addEventListener('mouseup', onMoveEnd);

    // set position tooltip
    let tooltips = $('#js-tooltip');
    window.onmousemove = function(e) {
      if (tooltips) {
        tooltips.css({ top: e.clientY + 5 + 'px' });
        tooltips.css({ left: e.clientX + 5 + 'px' });
      }
    };

    return () => {
      window.removeEventListener('resize', setWidthHeightCanvas);
      window.removeEventListener('mouseup', onMoveEnd);
    };
  }, []);

  function handleOnload() {
    setLoadingImage(false);
  }

  function setWidthHeightCanvas() {
    $(document).ready(() => {
      let jsViewImage = $('#js-view-image');
      jsViewImage.on('load', () => {
        handleSetCanvas();
      });
      handleSetCanvas();
    });
  }

  function handleSetCanvas(zoom = canvasState.current.zoom) {
    const jsImageContainer = document.getElementById('js-image-container');
    let jsViewImage = document.getElementById('js-view-image');
    let jsCanvasContainer = document.getElementById('js-canvas-container');
    let jsCanvas = document.getElementById('js-canvas');
    if (jsViewImage && jsCanvas && jsImageContainer) {
      const imageContainerWidth = jsImageContainer.offsetWidth.toString();
      const imageContainerHeight = jsImageContainer.offsetHeight.toString();
      const viewImageWidth = jsViewImage.offsetWidth.toString();
      const viewImageHeight = jsViewImage.offsetHeight.toString();
      const width = imageContainerWidth < viewImageWidth * zoom ? imageContainerWidth : viewImageWidth * zoom;
      const height = imageContainerHeight < viewImageHeight * zoom ? imageContainerHeight : viewImageHeight * zoom;
      jsCanvasContainer.style.width = width + 'px';
      jsCanvasContainer.style.height = height + 'px';
      jsCanvas.setAttribute('width', width);
      jsCanvas.setAttribute('height', height);

      imageContainerSize.current = {
        width: imageContainerWidth,
        height: imageContainerHeight,
      };

      canvasState.current = Object.assign({}, canvasState.current, {
        zoom,
        canvasSize: { width, height },
      });
      forceUpdate();
    }
  }

  function handleScrollZoom(e) {
    if (isLoadingImage) return;
    if (e.nativeEvent?.wheelDelta >= 120) zoomIn();
    if (e.nativeEvent?.wheelDelta <= -120) zoomOut();
    handleMoveTooltip();
  }

  async function zoomIn(zoomType = 'ZOOM_IN') {
    let zoom = Math.min(canvasState.current.zoom + 1, 10);
    if (zoom !== canvasState.current.zoom) {
      await handleSetCanvas(zoom);
      setOffsetRange(zoom, zoomType);
    }
  }

  async function zoomOut(zoomType = 'ZOOM_OUT') {
    let zoom = Math.max(1, canvasState.current.zoom - 1);
    if (zoom !== canvasState.current.zoom) {
      await handleSetCanvas(zoom);
      setOffsetRange(zoom, zoomType);
    }
  }

  function setOffsetRange(zoom = canvasState.current.zoom, zoomType = null) {
    let offsetTemp = JSON.parse(JSON.stringify(canvasState.current.offset));

    let dx, dy;
    if (image.current) {
      dx = image.current.scrollWidth * zoom;
      dy = image.current.scrollHeight * zoom;
      const imageContainer = $('#js-image-container');
      let height = imageContainer.height();
      let width = imageContainer.width();

      if (zoom === 1) {
        offsetRange.current = { x: 0, y: 0 };
      } else {
        offsetRange.current = {
          x: Math.max(0, (dx - width) / 2),
          y: Math.max(0, (dy - height) / 2),
        };

        if (zoomType) {
          offsetTemp = {
            x: (canvasState.current.canvasSize.width / 100) * positionOffsetZoom.current.x * (zoom - 1),
            y: (canvasState.current.canvasSize.height / 100) * positionOffsetZoom.current.y * (zoom - 1),
          };
        }
      }

      if (Math.abs(offsetTemp.x) >= offsetRange.current.x) {
        offsetTemp.x = offsetTemp.x < 0 ? Math.min(0, -offsetRange.current.x) : Math.max(0, offsetRange.current.x);
      }
      if (Math.abs(offsetTemp.y) >= offsetRange.current.y) {
        offsetTemp.y = offsetTemp.y < 0 ? Math.min(0, -offsetRange.current.y) : Math.max(0, offsetRange.current.y);
      }

      canvasState.current = Object.assign({}, canvasState.current, { offset: offsetTemp, zoom });
      forceUpdate();
    }
  }

  function setOffsetZoom(x, y) {
    positionOffsetZoom.current = { x, y };
  }

  function handleMoveTooltip() {
    let tooltips = $('#js-tooltip');
    clearTimeout(timer.current);
    timer.current = setTimeout(function() {
      tooltips.css({ display: 'none' });
    }, 200);
    tooltips.css({ display: 'block' });
  }

  function getScreenPosition() {
    const x =
      canvasState.current.zoom !== 1
        ? (canvasState.current.offset.x - offsetRange.current.x) / canvasState.current.canvasSize.width
        : 0;
    const y =
      canvasState.current.zoom !== 1
        ? (canvasState.current.offset.y - offsetRange.current.y) / canvasState.current.canvasSize.height
        : 0;
    return { x, y };
  }

  function handleDataEndDraw(data) {
    const jsImageContainer = document.getElementById('js-image-container');
    if (jsImageContainer) {
      const { scaleWidthRatio, scaleHeightRatio } = getRatio();
      const screenPosition = getScreenPosition();
      let dataDraw = cloneObj(data);

      if (dataDraw.type === 'RECTANGLE') {
        const offsetX = (dataDraw.position.offsetX - screenPosition.x) / scaleWidthRatio;
        const offsetY = (dataDraw.position.offsetY - screenPosition.y) / scaleHeightRatio;
        const width = dataDraw.position.width / scaleWidthRatio;
        const height = dataDraw.position.height / scaleHeightRatio;

        dataDraw.x = offsetX;
        dataDraw.y = offsetY;
        dataDraw.width = width;
        dataDraw.height = height;

        dataDraw.position = { offsetX, offsetY, width, height };
      } else if (dataDraw.type === 'POLYGON' && Array.isArray(dataDraw.position)) {
        let xMin = 1,
          yMin = 1,
          xMax = 0,
          yMax = 0;
        const position = dataDraw.position.map((item) => {
          const offsetX = (item.offsetX - screenPosition.x) / scaleWidthRatio;
          const offsetY = (item.offsetY - screenPosition.y) / scaleHeightRatio;
          xMin = xMin > offsetX ? offsetX : xMin;
          yMin = yMin > offsetY ? offsetY : yMin;
          xMax = xMax < offsetX ? offsetX : xMax;
          yMax = yMax < offsetY ? offsetY : yMax;
          return { offsetX, offsetY };
        });

        dataDraw.polygons = position;
        dataDraw.position = position;
        dataDraw.x = xMin;
        dataDraw.y = yMin;
        dataDraw.width = xMax - xMin;
        dataDraw.height = yMax - yMin;
      }
      props.setCanvasDataset(canvasNew);
    }
  }

  function handleDataEndMove(dataOutput) {
    const { scaleWidthRatio, scaleHeightRatio } = getRatio();
    const screenPosition = getScreenPosition();

    const canvasDatasetNew = dataOutput.map((output) => {
      if (output.type === CONSTANTS.RECTANGLE) {
        output.x = (output.x - screenPosition.x) / scaleWidthRatio;
        output.y = (output.y - screenPosition.y) / scaleHeightRatio;
        output.width = output.width / scaleWidthRatio;
        output.height = output.height / scaleHeightRatio;
      }
      if (output.type === CONSTANTS.POLYGON && Array.isArray(output.polygons)) {
        output.polygons = output.polygons.map((polygon) => {
          return {
            offsetX: (polygon.offsetX - screenPosition.x) / scaleWidthRatio,
            offsetY: (polygon.offsetY - screenPosition.y) / scaleHeightRatio,
          };
        });
      }
      return output;
    });
    props.setCanvasDataset(canvasDatasetNew);
  }

  function setOffsetMouse(mouseOffsetX, mouseOffsetY) {
    mouseOffset.current = { x: mouseOffsetX, y: mouseOffsetY };
  }

  function onMove(e) {
    if (e.type === 'mousemove' && ((!e.clientX && !e.clientY) || !draggable.current)) {
      return;
    }
    if (
      e.type === 'touchmove' &&
      (!e.touches || (!e.touches[0].clientX && !e.touches[0].clientY) || !draggable.current)
    ) {
      return;
    }

    let clientX = e.type === 'touchmove' ? (e.touches ? e.touches[0].clientX : e.clientX) : e.clientX;
    let clientY = e.type === 'touchmove' ? (e.touches ? e.touches[0].clientY : e.clientY) : e.clientY;
    const offsetDiff = {
      x: clientX - clientOffset.current.x,
      y: clientY - clientOffset.current.y,
    };
    clientOffset.current = {
      x: clientX,
      y: clientY,
    };

    const offset = {
      x: canvasState.current.offset.x + offsetDiff.x,
      y: canvasState.current.offset.y + offsetDiff.y,
    };
    canvasState.current = Object.assign({}, canvasState.current, { offset });
    setOffsetRange();
    forceUpdate();
  }

  function onMoveStart(e) {
    if (!offsetRange.current.x && !offsetRange.current.y) {
      return;
    }
    clientOffset.current = {
      x: e.type === 'mousedown' ? e.clientX : e.touches[0].clientX,
      y: e.type === 'mousedown' ? e.clientY : e.touches[0].clientY,
    };
    draggable.current = true;
  }

  function onMoveEnd() {
    if (!mounted.current || !draggable.current) return;
    draggable.current = false;
  }

  function getRatio() {
    let scaleWidthRatio = 1,
      scaleHeightRatio = 1;
    if (image.current?.scrollWidth && image.current?.scrollHeight) {
      const viewImageWidth = image.current?.scrollWidth;
      const viewImageHeight = image.current.scrollHeight;
      viewImageSize.current = {
        width: viewImageWidth,
        height: viewImageHeight,
      };

      if (canvasState.current.zoom === 1) {
        scaleWidthRatio = 1;
      } else if (imageContainerSize.current.width < viewImageWidth * canvasState.current.zoom) {
        scaleWidthRatio = (canvasState.current.zoom * viewImageWidth) / imageContainerSize.current.width;
      } else {
        scaleWidthRatio = 1;
      }
      if (canvasState.current.zoom === 1) {
        scaleHeightRatio = 1;
      } else if (imageContainerSize.current.height < viewImageHeight * canvasState.current.zoom) {
        scaleHeightRatio = (canvasState.current.zoom * viewImageHeight) / imageContainerSize.current.height;
      } else {
        scaleHeightRatio = 1;
      }
    }
    return { scaleWidthRatio, scaleHeightRatio };
  }

  function convertLocationByZoom(dataInput) {
    dataInput = cloneObj(dataInput);
    const { scaleWidthRatio, scaleHeightRatio } = getRatio();
    const screenPosition = getScreenPosition();
    dataInput.x = dataInput.x * scaleWidthRatio + screenPosition.x;
    dataInput.y = dataInput.y * scaleHeightRatio + screenPosition.y;
    dataInput.width = dataInput.width * scaleWidthRatio;
    dataInput.height = dataInput.height * scaleHeightRatio;
    return dataInput;
  }

  function handleClickCanvas() {

    let jsCanvasContainer = document.getElementById('js-canvas-container');
    const imageContainerWidth = jsCanvasContainer.offsetWidth.toString();
    const imageContainerHeight = jsCanvasContainer.offsetHeight.toString();

    const point = {
      offsetX: mouseOffset.current.x / imageContainerWidth,
      offsetY: mouseOffset.current.y / imageContainerHeight,
    };
    let insideThietBi = null;
    for (let i = 0; i < canvasDataset.length; i++) {
      const thietBi = canvasDataset[i];
      const polygons = genPolygonFromRectangle(convertLocationByZoom(thietBi));
      if (checkPointInsideObject(point, polygons)) {
        insideThietBi = thietBi;
        break;
      }
    }
  }

  const ratio = getRatio();
  const screenPosition = getScreenPosition();

  const listDataCanvas = canvasDataset.map((item) => convertLocationByZoom(item));

  return (
    <>
      <div className="review-image-container">
        <Tabs size="small" className="tab-title" tabBarExtraContent={<div style={{ height: 35 }} className="d-flex">
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={props.handleDeleteImage}
            cancelText="Hủy" okText="Xóa"
            placement="bottomRight"
            okButtonProps={{ type: 'danger' }}
          >
            <Button size="small" type="danger" className="m-auto" disabled={true}>
              <DeleteOutlined/>Xóa ảnh
            </Button>
          </Popconfirm>
        </div>}
        />
        <Loading active={false}>
          <div id={`js-image-container`} className="image-container">
            <Ratio type="4:3">
              <img
                id="js-view-image"
                className="view-image"
                alt=""
                style={{
                  transform: `translate(-50%,-50%) translate(${canvasState.current.offset.x}px, ${canvasState.current.offset.y}px) scale(${canvasState.current.zoom})`,
                }}
                onLoad={handleOnload}
                src={props.imageUrl}
                draggable={false}
                ref={image}
              />

              <div
                id={'js-canvas-container'}
                className={`canvas-container`}
                style={{ transform: 'translate(-50%,-50%)' }}
                onWheel={handleScrollZoom}
                onClick={handleClickCanvas}
                onDragStart={(e) => e.preventDefault()}
                onMouseMove={onMove}
                onMouseDown={onMoveStart}
                onMouseUp={onMoveEnd}
                onTouchStart={onMoveStart}
                onTouchMove={onMove}
                onTouchEnd={onMoveEnd}
              >
                {!!props.imageUrl && !isLoadingImage && (
                  <Canvas
                    id="js-canvas"
                    zoom={canvasState.current.zoom}
                    screenPosition={screenPosition}
                    ratio={ratio}
                    viewImageSize={viewImageSize.current}
                    onRef={(ref) => (canvasRef.current = ref)}
                    width={canvasState.current.canvasSize.width}
                    height={canvasState.current.canvasSize.height}
                    onEndDraw={handleDataEndDraw}
                    onEndMove={handleDataEndMove}
                    data={{ data: listDataCanvas }}
                    warning={'Cảnh báo'}
                    setOffsetMouse={setOffsetMouse}
                    setOffsetZoom={setOffsetZoom}
                  />
                )}
              </div>
            </Ratio>
          </div>
        </Loading>
      </div>
      {/*tooltip*/}
      <span id="js-tooltip" style={{ display: 'none', top: '50%', left: '50%' }}>
        {canvasState.current.zoom + 'x'}
      </span>
    </>
  );
}

export default ViewAndDrawImage;

ViewAndDrawImage.propTypes = {};

ViewAndDrawImage.defaultProps = {};
