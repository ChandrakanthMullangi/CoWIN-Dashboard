// Write your code here

import {Component} from 'react'

import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    lastSevenDaysVaccinationData: [],
    vaccinationByAgeData: '',
    vaccinationByGenderData: '',
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getCovidVaccinationData()
  }

  getFormattedData = data => ({
    vaccineDate: data.vaccine_date,
    dose1: data.dose_1,
    dose2: data.dose_2,
  })

  getCovidVaccinationData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(apiUrl)

    if (response.ok === true) {
      const fetchedData = await response.json()

      const updatedData = fetchedData.last_7_days_vaccination.map(eachDate =>
        this.getFormattedData(eachDate),
      )

      const vaccinationDetailsByAge = fetchedData.vaccination_by_age

      const vaccinationDetailsByGender = fetchedData.vaccination_by_gender

      this.setState({
        lastSevenDaysVaccinationData: updatedData,
        vaccinationByAgeData: vaccinationDetailsByAge,
        vaccinationByGenderData: vaccinationDetailsByGender,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-message"> Something Went Wrong </h1>
    </div>
  )

  renderSuccessView = () => {
    const {
      lastSevenDaysVaccinationData,
      vaccinationByAgeData,
      vaccinationByGenderData,
    } = this.state

    return (
      <>
        <VaccinationCoverage
          vaccinationCoverageDetails={lastSevenDaysVaccinationData}
        />
        <VaccinationByGender
          vaccinationByGenderDetails={vaccinationByGenderData}
        />
        <VaccinationByAge vaccinationByAgeDetails={vaccinationByAgeData} />
      </>
    )
  }

  renderCoWinDashboard = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="co-win-dashboard">
        <div className="logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="logo"
          />
          <h1 className="logo-name"> Co-Win </h1>
        </div>
        <h1 className="heading"> CoWin vaccination in India </h1>
        <div className="cowin-dashboard">{this.renderCoWinDashboard()}</div>
      </div>
    )
  }
}

export default CowinDashboard
