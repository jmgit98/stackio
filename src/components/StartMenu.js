import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import { FirebaseGoogleLogin, FirebaseFacebookLogin } from './FirebaseService';
import '../css/startmenu.css';
import AliasForm from './AliasForm';

class StartMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inLoginSection: false,
      inTutorSection: false,
      inAliasSection: false,
    };
    this.handleLoginButtonClick = this.handleLoginButtonClick.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.handleTutorButtonClick = this.handleTutorButtonClick.bind(this);
    this.handleUserLoggedIn = this.handleUserLoggedIn.bind(this);
    this.handleAliasFormSubmit = this.handleAliasFormSubmit.bind(this);
    this.handleLogoutButtonClick = this.handleLogoutButtonClick.bind(this);
    this.handleStartButtonClick = this.handleStartButtonClick.bind(this);
  }

  handleStartButtonClick() {
    this.props.onGameStart();
  }

  handleLoginButtonClick() {
    this.setState({
      inLoginSection: true,
    });
  }

  handleLogoutButtonClick() {
    this.props.onLogout();
    this.setState({
      inAliasSection: false,
    });
  }

  handleBackButtonClick() {
    this.setState({
      inLoginSection: false,
      inTutorSection: false,
      inAliasSection: false,
    });
  }

  handleTutorButtonClick() {
    this.setState({
      inTutorSection: true,
    });
  }

  handleUserLoggedIn(userInfo) {
    console.log(this.props.hasAlias);
    this.props.onLogin(userInfo);
    console.log(this.props.hasAlias);
    this.setState((state, props) => ({
      inLoginSection: !props.isLoggedIn,
      inAliasSection: !props.hasAlias,
    }));
    console.log(this.props.hasAlias);
  }

  handleAliasFormSubmit(alias) {
    console.log(this.props.hasAlias);
    this.props.onAliasFormSubmit(alias);
    console.log(this.props.hasAlias);
    this.setState((state, props) => ({
      inAliasSection: !props.hasAlias,
    }));
    console.log(this.props.hasAlias);
  }

  resolveMenuSectionView() {
    if (this.state.inLoginSection) {
      return (
        <ul className='start-menu-options'>
          <li> <Button name="👈" onClick={this.handleBackButtonClick}/> </li>
          <li> <FirebaseGoogleLogin onLogin={this.handleUserLoggedIn}/> </li>
          <li> <FirebaseFacebookLogin onLogin={this.handleUserLoggedIn}/> </li>
        </ul>
      );
    }
    if (this.state.inTutorSection) {
      return (
        <Instruction title="🎲 RULES">
            <Button name="👈" onClick={this.handleBackButtonClick}/>
        </Instruction>
      );
    }
    if (this.state.inAliasSection) {
      return (
          <AliasForm placeholder={this.props.aliasFormPh}
                      onSubmit={this.handleAliasFormSubmit}
                      onLogout={this.handleLogoutButtonClick}/>
      );
    }
    return (
      <ul className='start-menu-options'>
        <li> <Button name="start" onClick={this.handleStartButtonClick}/> </li>
        <li> <Button name="tutorial" onClick={this.handleTutorButtonClick}/> </li>
        {this.props.isLoggedIn ? (
          <li> <Button name="logout" onClick={this.handleLogoutButtonClick}/> </li>
        ) : (
          <li> <Button name="login" onClick={this.handleLoginButtonClick}/> </li>
        )}
      </ul>
    );
  }

  render() {
    return (
      <div className='start-menu'>
        {this.resolveMenuSectionView()}
      </div>
    );
  }
}

function Instruction(props) {
  return (
    <ul className="instruction">
      <li key="info" id="instruction-info">
        <div>
          <h2> {props.title} </h2>
          <p> Stack up blocks as high as possible!</p>
          <p> </p>
          <p>
            You will only need to hit <b>SPACE</b>
             or <b>CLICK</b> or <b>TAP</b> to
             lay a new block on stack!
          </p>
        </div>
      </li>
      {
        React.Children.map(props.children,
          (item, index) => <li key={index}>{item}</li>)
      }
    </ul>
  );
}

Instruction.propTypes = {
  title: PropTypes.string,
  children: PropTypes.object,
};

StartMenu.propTypes = {
  isLoggedIn: PropTypes.bool,
  hasAlias: PropTypes.bool,
  aliasFormPh: PropTypes.string,
  onAliasFormSubmit: PropTypes.func,
  onLogin: PropTypes.func,
  onLogout: PropTypes.func,
  onGameStart: PropTypes.func,
};

export default StartMenu;