import React from 'react'
import { Dropdown, Nav } from "react-bootstrap";
import { ThemeChanger } from "../../redux/actions";
import store from '@/shared/redux/store';
import { connect } from 'react-redux';

const HeadDropDown = ({ local_varaiable, ThemeChanger }: { local_varaiable: any, ThemeChanger: any }) => {
  //Dark Model
  const ToggleDark = () => {

    ThemeChanger({
      ...local_varaiable,
      "dataThemeMode": local_varaiable.dataThemeMode == 'dark' ? 'light' : 'dark',
      "dataHeaderStyles": local_varaiable.dataHeaderStyles == 'dark' ? 'light' : 'dark',
      "dataMenuStyles": local_varaiable.dataNavLayout == 'horizontal' ? local_varaiable.dataMenuStyles == 'light' ? 'dark' : 'dark' : "dark"


    })
    const theme = store.getState()

    if (theme.dataThemeMode != 'dark') {
      ThemeChanger({
        ...theme,
        "bodyBg": '',
        "bodyBg1": '',
        "lightRgb": "",
        "formControl": "",
        "inputBorder": "",
        "sidemenuActiveBgcolor": ""
      })
      localStorage.setItem("Spruhalighttheme", "dark")
      localStorage.removeItem("Spruhadarktheme")

    }
    else {
      localStorage.setItem("Spruhadarktheme", "dark")
      localStorage.removeItem("Spruhalighttheme")
    }

  }
  function Fullscreen() {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    } else {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
    }
  }



  // const openCloseSidebar1 = () => {
  //   document.querySelector("#right-sidebar-canvas")?.classList.toggle("show");
  //   document.querySelector("body")!.classList.add("overflow:hidden");
  //   document.querySelector("body")!.classList.add("padding-right:4px");

  //   if (document.querySelector(".switcher-backdrop")?.classList.contains('d-none')) {
  //     document.querySelector(".switcher-backdrop")?.classList.add("d-block");
  //     document.querySelector(".switcher-backdrop")?.classList.remove("d-none");
  //   }
  // };

  return (
    <>
      {/* theming  */}
      <Dropdown className="header-element header-theme-mode">
        <Nav.Link className="header-link layout-setting" onClick={() => ToggleDark()}>
          <span className="dark-layout">
            <i className="fe fe-sun header-link-icon"></i>
          </span>
          <span className="light-layout">
            <i className="fe fe-moon header-link-icon lh-2"></i>
          </span>
        </Nav.Link>
      </Dropdown>
      {/* end of theming */}
      <div className="header-element header-fullscreen d-xl-flex d-none">
        <div
          className="header-link d-xl-block d-none"
          onClick={Fullscreen}
        >
          <i className="fe fe-maximize full-screen-open header-link-icon"></i>
        </div>
      </div>
    </>
  )
}
const mapStateToProps = (state: any) => ({
  local_varaiable: state
})
export default connect(mapStateToProps, { ThemeChanger })(HeadDropDown);


