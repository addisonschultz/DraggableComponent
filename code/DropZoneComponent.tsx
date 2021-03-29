import * as React from "react";
import { motion, addPropertyControls, ControlType } from "framer";

interface DraggableProps {
  height: number;
  width: number;
  draggableChildren: JSX.Element[];
}

export const DropZoneComponent = ({ draggableChildren }: DraggableProps) => {
  const dropZone1Ref = React.useRef(null);
  const dropZone2Ref = React.useRef(null);

  const [zone1, setZone1] = React.useState({
    offsetLeft: null,
    offsetTop: null,
    clientWidth: null,
    clientHeight: null,
  });
  const [zone2, setZone2] = React.useState({
    offsetLeft: null,
    offsetTop: null,
    clientWidth: null,
    clientHeight: null,
  });

  React.useEffect(() => {
    setZone1({
      offsetLeft: dropZone1Ref.current.offsetLeft,
      offsetTop: dropZone1Ref.current.offsetTop,
      clientWidth: dropZone1Ref.current.clientWidth,
      clientHeight: dropZone1Ref.current.clientHeight,
    });
    setZone2({
      offsetLeft: dropZone2Ref.current.offsetLeft,
      offsetTop: dropZone2Ref.current.offsetTop,
      clientWidth: dropZone2Ref.current.clientWidth,
      clientHeight: dropZone2Ref.current.clientHeight,
    });
  }, [dropZone1Ref, dropZone2Ref]);

  const [zone1Drop, setZone1Drop] = React.useState({
    dropped: false,
    child: null,
  });
  const [zone2Drop, setZone2Drop] = React.useState({
    dropped: false,
    child: null,
  });

  function onZoneDrop(point, child) {
    if (
      point.x > zone1.offsetLeft &&
      point.x < zone1.offsetLeft + zone1.clientWidth &&
      point.y > zone1.offsetTop &&
      point.y < zone1.offsetTop + zone1.clientHeight
    ) {
      setZone1Drop({ dropped: true, child: child });
      setZone2Drop({ dropped: false, child: child });
    }
    if (
      point.x > zone2.offsetLeft &&
      point.x < zone2.offsetLeft + zone2.clientWidth &&
      point.y > zone2.offsetTop &&
      point.y < zone2.offsetTop + zone2.clientHeight
    ) {
      setZone1Drop({
        dropped: false,
        child: child,
      });
      setZone2Drop({ dropped: true, child: child });
    }
  }

  const handleDragEnd = (info, child) => {
    setZone1Drop({ ...zone1Drop, child });
    setZone1Drop({ ...zone2Drop, child });
    onZoneDrop(info.point, child);
  };

  // Sidebar
  function SizeZone() {
    return (
      <motion.div style={sideZoneStyle}>
        {React.Children.map(draggableChildren, (child, index) => {
          return React.cloneElement(child, {
            key: index,
            drag: true,
            initial: false,
            dragConstraints: { top: 0, left: 0, right: 0, bottom: 0 },
            dragElastic: 1,
            style: {
              position: "relative",
              zIndex: 1,
              ...child.props.style,
            },
            onDragEnd: (e, info) => handleDragEnd(info, child),
          });
        })}
      </motion.div>
    );
  }

  // Drop Zone
  const DropZone = ({ dropZoneRef, animate }) => {
    return (
      <motion.div style={dropZoneStyle} ref={dropZoneRef} animate={animate} />
    );
  };

  return (
    <div
      style={{
        width: 1440,
        height: 900,
        position: "absolute",
        display: "flex",
      }}
    >
      <SizeZone />
      <div id={"drop-zone-container"} style={dropZoneContainerStyle}>
        <DropZone
          dropZoneRef={dropZone1Ref}
          animate={
            zone1Drop.dropped
              ? {
                  backgroundColor: zone1Drop.child.props.style.backgroundColor,
                }
              : { backgroundColor: "#fff" }
          }
        />
        <DropZone
          dropZoneRef={dropZone2Ref}
          animate={
            zone2Drop.dropped
              ? {
                  backgroundColor: zone1Drop.child.props.style.backgroundColor,
                }
              : { backgroundColor: "#fff" }
          }
        />
      </div>
    </div>
  );
};

addPropertyControls(DropZoneComponent, {
  draggableChildren: {
    type: ControlType.Array,
    control: {
      type: ControlType.ComponentInstance,
      title: "Box",
    },
  },
});

const sideZoneStyle = {
  width: 240,
  height: "100%",
  backgroundColor: "#fff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-evenly",
};

const dropZoneStyle = {
  width: 288,
  height: 172,
  backgroundColor: "#fff",
  borderRadius: 5,
};

const dropZoneContainerStyle = {
  width: "100%",
  height: "100%",
  margin: "auto auto",
  display: "flex",
  justifyContent: "space-evenly",
  alignItems: "center",
  backgroundColor: "#aaa",
};

DropZoneComponent.defaultProps = {
  height: 900,
  width: 1440,
};
