import "./Home.css";
import Tasks from "./Tasks";
import Schedule from "./Schedule";

function Home() {
  return (
    <div className="home-schedule">
      <Tasks />
      <Schedule />
    </div>
  );
}
export default Home;