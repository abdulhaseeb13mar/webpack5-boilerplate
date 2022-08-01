import { Skeleton } from "@mui/material";

const SkeletonComponent = () => {
  return (
    <div className="c-c-c">
      <div className="r-c-sb" style={{ width: "100%" }}>
        <Skeleton
          variant="text"
          width={62}
          height={80}
          style={{ margin: "auto" }}
        />
        <Skeleton
          variant="text"
          width={62}
          height={80}
          style={{ margin: "auto" }}
        />
        <Skeleton
          variant="text"
          width={62}
          height={80}
          style={{ margin: "auto" }}
        />
        <Skeleton
          variant="text"
          width={62}
          height={80}
          style={{ margin: "auto" }}
        />
      </div>
      <div className="c-c-fs">
        <Skeleton
          variant="text"
          width={325}
          height={70}
          style={{ margin: "0px" }}
        />
        <Skeleton
          variant="text"
          width={325}
          height={70}
          style={{ margin: "0px" }}
        />
        <Skeleton
          variant="text"
          width={325}
          height={70}
          style={{ margin: "0px" }}
        />
      </div>
    </div>
  );
};

export default SkeletonComponent;
