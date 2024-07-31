import NavbarLinks from "./navbar-links";
import UserMenu from "./user-menu";

export default function NavbarMain() {
    return (
      <>
        <div className="flex flex-row items-center z-50 sticky top-0 bg-stone-800 h-20">
          <UserMenu />
          <NavbarLinks />
        </div>
      </>
    );
}