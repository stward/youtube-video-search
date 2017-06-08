import React, { Component } from 'react'
import { AutoComplete }     from 'material-ui';
import JSONP                from 'jsonp';
import YoutubeFinder        from 'youtube-finder';
import getMuiTheme          from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider     from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const googleAutoSuggestURL = '//suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=';

class MaterialUIAutocomplete extends Component {
  constructor(props) {
    super(props);
    this.onUpdateInput  = this.onUpdateInput.bind(this);
    this.onNewRequest   = this.onNewRequest.bind(this);
    this.YoutubeClient  = YoutubeFinder.createClient({ key: 'AIzaSyAUvgf65bdgjYFq9hI5RUqRcgQA3hOzs34' });
    this.state = {
      dataSource : [],
      inputValue : ''
    }
  }

  performSearch() {
    const
      self = this,
      url  = googleAutoSuggestURL + this.state.inputValue;

    if(this.state.inputValue !== '') {
      JSONP(url, function(error, data) {
        let searchResults, retrievedSearchTerms;

        if(error) return console.log(error);

        searchResults = data[1];

        retrievedSearchTerms = searchResults.map(function(result) {
          return result[0];
        });

        self.setState({
          dataSource : retrievedSearchTerms
        });
      });
    }
  }

  onUpdateInput(inputValue) {
    const self = this;

    this.setState({
      inputValue : inputValue
      },function(){
      self.performSearch();
    });
  }

  onNewRequest(searchTerm) {
    const
      self   = this,
      params = {
        part        : 'id,snippet',
        type        : 'video',
        q           : this.state.inputValue
      }

    this.YoutubeClient.search(params, function(error,results) {
      if(error) return console.log(error);
      self.props.callback(results.items,searchTerm);
      self.setState({
        dataSource : [],
        inputValue : ''
      });
    });
  }

  render() {
    return <MuiThemeProvider muiTheme={getMuiTheme()}>
      <AutoComplete
        searchText          ={this.state.inputValue}
        floatingLabelText   ={this.props.placeHolder}
        filter              ={AutoComplete.noFilter}
        openOnFocus         ={true}
        dataSource          ={this.state.dataSource}
        onUpdateInput       ={this.onUpdateInput}
        onNewRequest        ={this.onNewRequest}
        hintText            ='test'
      />
    </MuiThemeProvider>
  }
}


export default MaterialUIAutocomplete;
