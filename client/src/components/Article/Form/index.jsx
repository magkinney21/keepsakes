import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      body: '',
      author: '',
      photo:'',
    }

    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.articleToEdit) {
      this.setState({
        title: nextProps.articleToEdit.title,
        body: nextProps.articleToEdit.body,
        author: nextProps.articleToEdit.author,
        photo: nextProps.articleToEdit.photo,
      });
    }
  }

  handleSubmit(){
    const { onSubmit, articleToEdit, onEdit } = this.props;
    const { title, body, author, photo } = this.state;

    if(!articleToEdit) {
      return axios.post('http://localhost:8000/api/articles', {
        title,
        body,
        author,
        photo,
      })
        .then((res) => onSubmit(res.data))
        .then(() => this.setState({ title: '', body: '', author: '', photo: '', }));
    } else {
      return axios.patch(`http://localhost:8000/api/articles/${articleToEdit._id}`, {
        title,
        body,
        author,
        photo,
      })
        .then((res) => onEdit(res.data))
        .then(() => this.setState({ title: '', body: '', author: '', photo: '', }));
    }
  }

  handleChangeField(key, event) {
    this.setState({
      [key]: event.target.value,
    });
  }

  render() {
    const { articleToEdit } = this.props;
    const { title, body, author, photo } = this.state;

    return (
    <div>
      <button type="button" class="btn btn-outline-info" data-toggle="modal" data-target="#exampleModalCenter">
        <i class="fas fa-plus"></i>      
      </button>
      <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalCenterTitle">Upload Memories</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          <div className="col-12 col-lg-6 offset-lg-3">
            <input
              onChange={(ev) => this.handleChangeField('title', ev)}
              value={title}
              className="form-control my-3"
              placeholder="Title"
            />
            <textarea
              onChange={(ev) => this.handleChangeField('body', ev)}
              className="form-control my-3"
              placeholder="Body"
              value={body}>
            </textarea>
            <input
              onChange={(ev) => this.handleChangeField('author', ev)}
              value={author}
              className="form-control my-3"
              placeholder="Author"
            />
            <input
              onChange={(ev) => this.handleChangeField('photo', ev)}
              value={photo}
              className="form-control my-3"
              placeholder="Photo"
            />
          </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
            <button onClick={this.handleSubmit} className="btn btn-dark float-right" data-dismiss="modal" >{articleToEdit ? 'Update' : 'Submit'}</button>
          </div>
        </div>
      </div>
    </div>
      
    </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  onSubmit: data => dispatch({ type: 'SUBMIT_ARTICLE', data }),
  onEdit: data => dispatch({ type: 'EDIT_ARTICLE', data }),
});

const mapStateToProps = state => ({
  articleToEdit: state.home.articleToEdit,
});

export default connect(mapStateToProps, mapDispatchToProps)(Form);