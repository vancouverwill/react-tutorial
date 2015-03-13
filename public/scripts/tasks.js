
var ToDoList = React.createClass({
  getInitialState: function() {
    this.bread = [1,2,    3, 4,5,6];
    return {data: []};
  },
  componentDidMount : function() {
     this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  loadCommentsFromServer: function() {
    $.ajax({
      url: "tasks.json",
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
        console.log("complete");
        console.log(this.state.data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleTaskSubmit: function(task) {
    var tasks = this.state.data;
    tasks.push(task);
    // 
    this.setState({data: tasks}, function() {
      $.ajax({
          url: this.props.url,
          dataType: 'json',
          type: 'POST',
          data: task,
          success: function(data) {
            this.setState({data: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
    });
  },
  render: function() {
    return (
      <div id="toDoList">
        <p>checkboxes</p>
        <CheckboxList data11={this.bread} data={this.state.data} />
        
        <p>footer</p>
        <AddItem   random="simple"  onTaskSubmit={this.handleTaskSubmit} />
      </div>
    );
  }
});

var CheckboxList = React.createClass({
  getInitialState: function() {
    console.log(this.props.data11);

    return {data: []};
  },
  render: function() {
    var checkBoxes = this.props.data.map(function (e) {
      console.log("in checkboxes")
      console.log(e.content)
      return (
          <Checkbox content={e.content} />
        );
    });
    return (
      <div className="randomList">
        {checkBoxes}
      </div>
    );
  }
});

var Checkbox = React.createClass({
  handleDelete: function(e) {
    e.preventDefault();
    console.log("handleDelete");
    console.log(this.props.content);
    console.log(this.props.other);
  },
  render: function() {
    return (
      <form>
        <input type="checkbox" name="vehicle" value="Bike"/> I have a goal to :{this.props.content} <a href="" onClick={this.handleDelete}>X</a><br/>
      </form>
    );
  }
});

var AddItem = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    
    var content = this.refs.content.getDOMNode().value.trim();
    console.log("submit " + content);
    console.log("url " + this.props.url);
    console.log("submit " + this.props.random);


    var contentItem = {content : content, other : "nothing"};

    console.log(contentItem);

    this.props.onTaskSubmit(contentItem);
    
    this.refs.content.getDOMNode().value = '';

  },
  render: function() {
    return (
      <form className="AddItemForm" onSubmit={this.handleSubmit}>
        <input type="text" ref="content"></input>
        <input  type="submit" value="Post" />
      </form>
    );
  }
});

React.render(
  <ToDoList   url={"tasks.json"}   pollInterval={10000} />,
  document.getElementById('content2')
);