import config from "../config";

const ClickThis = () => {
  const handleClick = async () => {
    try {
      const response = await fetch(`http://${config.SERVER_URL}/food/up`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log("Request sent successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Send Request</button>
    </div>
  );
};

export default ClickThis;
