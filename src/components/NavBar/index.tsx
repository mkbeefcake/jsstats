import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import {
  Database,
  HardDrive,
  Globe,
  Tool,
  Film,
  DollarSign,
  Gift,
  UserPlus,
  Award,
  Crosshair,
  Clipboard,
  Twitch,
  Mail,
  Target,
} from "react-feather";
import { Link } from "react-router-dom";
import joystream from "../../joystream.svg";

const NavBar = (props) => {
  const { toggleShowNotes } = props;

  return (
    <Navbar stikcy="top" variant="dark" expand="lg">
      <Navbar.Brand href="/">
        <img src={joystream} alt="Joystream logo" />
        <span className="ml-2" style={{ color: "orange" }}>
          stats
        </span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="p-2 d-flex flex-wrap">
          <Link to={"/media"} className="mr-1" title="Videos">
            <Film />
          </Link>
          <Link to={"/storage"} className="mx-1" title="Storage">
            <HardDrive />
          </Link>
          <Link to={"/distribution"} className="mx-1" title="Distribution">
            <Globe />
          </Link>
          <Link to={"/forum"} className="mx-1" title="Forum">
            <Twitch />
          </Link>
          <Link to={"/spending"} className="mx-1" title="Spending">
            <DollarSign />
          </Link>
          <Link to={"/bounties"} className="mx-1" title="Bounties">
            <Gift />
          </Link>
          <Link to={"/openings"} className="mx-1" title="Openings">
            <UserPlus />
          </Link>
          <Link to={"/grading"} className="mx-1" title="Grading">
            <Award />
          </Link>
          <Link to={"/election"} className="mx-1" title="Election">
            <Mail />
          </Link>
        </Nav>
        <NavDropdown title={<Target />} id="gov-dropdown">
          <Link to={"/councils"} className="dropdown-item" role="button">
            Council
          </Link>

          <NavDropdown.Divider />
          <Link to={"/groups/curation"} className="dropdown-item" role="button">
            Curation
          </Link>
          <Link to={"/groups/builders"} className="dropdown-item" role="button">
            Builders
          </Link>
          <Link to={"/groups/storage"} className="dropdown-item" role="button">
            Storage
          </Link>
          <Link
            to={"/groups/distribution"}
            className="dropdown-item"
            role="button"
          >
            Distribution
          </Link>
          <Link
            to={"/groups/marketing"}
            className="dropdown-item"
            role="button"
          >
            Marketing
          </Link>
          <Link to={"/groups/HR"} className="dropdown-item" role="button">
            HR
          </Link>
        </NavDropdown>
        <div className="ml-auto">
          <Nav className="p-2 d-flex flex-wrap">
            <div title="Notes">
              <Clipboard
                className="mx-1"
                color="white"
                onClick={toggleShowNotes}
              />
            </div>

            <Link to={"/issues"} className="mx-1" title="Tasks">
              <Crosshair />
            </Link>
            <Link to={"/data"} className="mx-1" title="Data Sources">
              <Database />
            </Link>
            <Link to={"/settings"} className="mx-1" title="Settings">
              <Tool />
            </Link>
          </Nav>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
