import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCommentDoctor, checkUserComment, handleComment, handleDeleteComment } from '../../../services/userService';
import { LANGUAGES } from '../../../utils'
import './Comment.scss';
import moment from 'moment';
import { toast } from 'react-toastify';
// import { FormattedMessage } from 'react-intl';

class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctorId: null,
            userId: '',
            isTextareaDisabled: true,
            hasCancelButton: false,
            comments: [],
            content: '',
            userInfo: '',
        }
    }

    async componentDidMount() {
        let res = await getCommentDoctor(this.props.doctorIdFromParent);

        if (res && res.errCode === 0) {
            this.setState({
                comments: res.data ? res.data : [],
                doctorId: this.props.doctorIdFromParent,
            })
        }

        if (this.props.isLoggedIn) {
            let resCheck = await checkUserComment(this.props.doctorIdFromParent, this.props.userInfo.id);

            if (resCheck && resCheck.errCode === 0) {
                this.setState({
                    isTextareaDisabled: false,
                })
            }
        }
    }

    async componentDidUpdate(prevProps, nextState, snapshot) {
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let res = await getCommentDoctor(this.props.doctorIdFromParent);

            if (res && res.errCode === 0) {
                this.setState({
                    comments: res.data ? res.data : [],
                    doctorId: this.props.doctorIdFromParent,
                })
            }
            if (this.props.isLoggedIn) {
                let resCheck = await checkUserComment(this.props.doctorIdFromParent, this.props.userInfo.id);

                if (resCheck && resCheck.errCode === 0) {
                    this.setState({
                        isTextareaDisabled: false,
                    })
                }
            }
        }

        if (this.props.userIdFromParent !== prevProps.userIdFromParent) {

        }
    }

    loadComment = async () => {

    }

    setText = (content) => {
        this.setState({
            content: content
        })
    }

    handleComment = async () => {
        let res = await handleComment({
            doctorId: this.props.doctorIdFromParent,
            patientId: this.props.userInfo.id,
            content: this.state.content,
        });

        if (res && res.errCode === 0) {
            toast.success("???? ????ng b??nh lu???n");
            let resComment = await getCommentDoctor(this.props.doctorIdFromParent);

            if (resComment && resComment.errCode === 0) {
                this.setState({
                    comments: resComment.data ? resComment.data : [],
                    content: '',
                })
            }
        } else {
            toast.error("????ng b??nh lu???n kh??ng th??nh c??ng");
        }
    }

    handleDeleteComment = async (commentId) => {
        let res = await handleDeleteComment(commentId);

        if (res && res.errCode === 0) {
            toast.success("???? xo?? b??nh lu???n");
            let resComment = await getCommentDoctor(this.props.doctorIdFromParent);

            if (resComment && resComment.errCode === 0) {
                this.setState({
                    comments: resComment.data ? resComment.data : [],
                })
            }
        } else {
            toast.error("Xo?? b??nh lu???n kh??ng th??nh c??ng");
        }
    }

    render() {
        let { isTextareaDisabled, hasCancelButton, comments } = this.state;
        if (!this.props.doctorIdFromParent) return (<p>Loading...</p>)
        // JSX
        return (
            <div>
                <div className="comment">
                    <div className='comment-title'>Ph???n h???i c???a b???nh nh??n sau khi ??i kh??m</div>
                    <textarea
                        className="comment-form-textarea"
                        onChange={(e) => this.setText(e.target.value)}
                        disabled={isTextareaDisabled}
                        value={this.state.content}
                    />
                    <button className="comment-form-button"
                        disabled={isTextareaDisabled}
                        onClick={this.handleComment}
                    >
                        B??nh lu???n
                    </button>

                    <div className="list-group">
                        {comments ? comments.map((item, index) => {
                            return (
                                <div href="#" className="list-group-item list-group-item-action flex-column align-items-start" key={index}>
                                    <div className="d-flex w-100 justify-content-between">
                                        <h5 className="mb-1 comment-item-name">{item.patientDataComment.lastName ? item.patientDataComment.lastName : "" + " " + item.patientDataComment.firstName ? item.patientDataComment.firstName : ""} <h5 className='date'>{moment(item.date, "'YYYYMMDDHHmmss'").format("DD-MM-YYYY")}</h5></h5>
                                        {this.props.isLoggedIn && item.patientDataComment.id === this.props.userInfo.id ? <button className='btn btn-danger' onClick={() => this.handleDeleteComment(item.id)}>Xo??</button> : null}
                                    </div>
                                    <p className="mb-1">{item.content}</p>
                                </div>
                            )
                        }) : ""}
                    </div>

                </div>
            </div>
        )

    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo,
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
