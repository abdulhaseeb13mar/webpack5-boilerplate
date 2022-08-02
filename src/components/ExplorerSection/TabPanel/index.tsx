import { Box } from "@mui/material";

const TabPanel = (props: any) => {
  /* global-state */
  const { children, value, index, ...other } = props;

  /* local-state */

  /* hooks */

  /* functions */

  /* effects */

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

export default TabPanel;
