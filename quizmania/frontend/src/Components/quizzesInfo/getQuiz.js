import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import '../../stylesheets/quizDetails.css'


class Quiz extends Component {

    state = {
        showbtn: [],
        isRefreshed: this.props.location.state

    }

    update = () => {
        window.location.reload()

    }
    delete = (id,question) =>{
        axios.post('http://192.168.43.135:80/deleteques',{id,question}).then(
            window.location.reload()
        )

    }
    show = (index) => {

        // store current staus array in a new arrray
        const newShowbtn = [...this.state.showbtn]

        // get the current status at the  given index
        const currentStatus = this.state.showbtn[index];

        // toggling the  status 
        newShowbtn[index] = !currentStatus

        // setting state with the new array
        this.setState({
            showbtn: newShowbtn
        })
    }
    render() {
        //getting the quizData from redux store state 
        const quiz = this.props.quiz

        //on initial render the methods on the quiz may generate an error as the quiz will be undefined
        // so this is a check if the quiz is undefined just render no questions 

        if (quiz === undefined) {
            return (
                <h1>No questions</h1>
            )
        }

        //if the quiz have some data then
        else {

            // getting questions from that quiz 
            const questions = quiz.questions
            const quizName = quiz.quizName

            //checking if their exists some questions on that quiz and will store the whole data in "questionList"
            const questionsList = questions.length ? (

                //if questions exist that map the questions one by one
                questions.map((question, index) => {

                    //render every question and its details
                    return (

                        //rendering a div of every question with the key value the id of that question
                        <div className="question-container" key={question._id}>
                            
                            <div className="single_question_container">


                            <h4 className="question">{question.questionString}</h4>
                            <Link to={{
                                pathname: '/edit/' + quiz.quiz_id,
                                state: { question, quizName }

                            }}><button className="edit-dlt-view-btn edit-view">Edit</button></Link>

                            <button id="delete" className="edit-dlt-view-btn" onClick={() => this.delete(quiz.quiz_id, question)} >delete</button>

                            {/* Link is used for future use */}
                            <Link to="#">

                                {/* Calling function  passing the current index  */}
                                <button className="edit-dlt-view-btn edit-view" onClick={(e) => {
                                    this.show(index)
                                }} value="View more">viewmore</button>
                            </Link>

                            {/* classname is decided by the showbtn status at that index */}
                            <div className={this.state.showbtn[index] ? "questions_box boxactive" : "questions_box boxhidden " + index} id="options-container">

                                <p className="options">Option1:-{question.option1}</p>
                                <p className="options">Option2:-{question.option2}</p>
                                <p className="options">Option3:-{question.option3}</p>
                                <p className="options">Option4:-{question.option4}</p>
                                <p className="options correct">Correct:-{question.correct}</p>
                            </div>

                            </div>


                        </div>


                    )
                })
            )
                //if questions doesnt exist just render no questions
                : (
                    <h1> No questions</h1>
                )


            // the main return method of the component
            return (

                //rendering the questionList created above with all the data

                <div className="get_quiz_Container">
                    <h1 className="quiz_name">QuizName: {quizName}</h1>
                    <hr/> 
                    <Link to={{
                        pathname: '/getquiz/' + this.props.match.params.quiz_id
                    }}><button className={this.state.isRefreshed ? "refresh active" : "refresh"} onClick={this.update} id="refresh-btn">Update All</button></Link>
                    {questionsList}

                    <Link to={{
                        pathname: '/insertques/' + this.props.match.params.quiz_id
                    }}><button className="edit-dlt-view-btn" id="add">Add Questions</button></Link>
                </div>
            )
        }


    }
}



//Maping quiz to props that are stored in the store by dispatching action
const MapStateToProps = (state, defaultProps) => {
    //defaultProps are the basic props of the component that can give access to route params 
    // so that we know which quiz to fetch

    // getting  id from router params and cnverting to int so that is is able to be compared 
    const id = parseInt(defaultProps.match.params.quiz_id)

    //returning the particular quiz that is to be viewed
    return {

        // find method iterates every quiz in the quizzes and return that quiz whose id matches the id we get from the params above
        quiz: state.quizzes.find(quiz => quiz.quiz_id === id),

    }

}

//exporting the components wrapped with HOC
export default connect(MapStateToProps)(Quiz)