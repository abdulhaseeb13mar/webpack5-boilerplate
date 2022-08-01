import { GenericBox, Text } from "@styled";

const RecentTabs = () => {
  /* global-state */

  /* local-state */

  /* hooks */

  /* functions */

  /* effects */

  /* constants */
  const tabs = ["BUSD", "BNB", "PING"];
  return (
    <div>
      <div className="r-c-fs recentTabTitle">
        <Text customColor="#5E5E64" size={13} weight={600}>
          Recent
        </Text>
      </div>
      <div className="r-c-fs" style={{ marginLeft: "20px" }}>
        {tabs.map((tab, index) => {
          return (
            <GenericBox
              key={index}
              style={{
                padding: `8px 15px 8px 15px`,
                margin: "0px 5px 0px 0px",
                fontSize: "13px",
                fontWeight: "500",
                borderRadius: "12px",
              }}
            >
              <Text size={13}> {tab}</Text>
            </GenericBox>
          );
        })}
      </div>
    </div>
  );
};

export default RecentTabs;
