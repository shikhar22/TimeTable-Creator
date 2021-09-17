import React, { Component } from "react";
import { DayPilot, DayPilotCalendar } from "daypilot-pro-react";
import "./CalendarStyles.css";
import { AgGridReact } from "@ag-grid-community/react";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { SetFilterModule } from "@ag-grid-enterprise/set-filter";
import { MenuModule } from "@ag-grid-enterprise/menu";
import { extend, removeClass } from '@syncfusion/ej2-base';
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import "@ag-grid-community/core/dist/styles/ag-grid.css";
import "@ag-grid-community/core/dist/styles/ag-theme-alpine.css";
import "@ag-grid-community/core/dist/styles/ag-theme-balham.css";
import MainCalendar from "./MainCalendar";
import { ContextMenuComponent } from '@syncfusion/ej2-react-navigations';
import "./calendar.css";
import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  ViewDirective,
  ViewsDirective,
  Inject,
} from "@syncfusion/ej2-react-schedule";

var data = [
];

const styles = {
  wrap: {
    display: "flex",
  },
  left: {
    width: "500px",
  },
  main: {
    flex: "1",
  },
};

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id:0,
      delId:0,
      subject: "",
      code: "",
      title: "",
      section: "",
      startTime: "",
      endTime: "",
      instructor: "",
      start: "",
      end: "",
      viewType: "Week",
      classPattern: "",
      sTime:Date,
      eTime:Date,
      durationBarVisible: false,
      modules: [
        ClientSideRowModelModule,
        SetFilterModule,
        MenuModule,
        ColumnsToolPanelModule,
      ],
      columnDefs: [
        {
          headerName: "Course ID",
          field: "Course ID",
          filter: true,
          filterParams: {
            defaultToNothingSelected: true,
            suppressSelectAll: true,
          },
        },
        {
          headerName: "Subject",
          field: "Subject",
          filter: "agSetColumnFilter",
          valueGetter: abValueGetter,
          filterParams: {
            defaultToNothingSelected: true,
            suppressSelectAll: true,
          },
        },
        {
          headerName: "Course Title",
          field: "CourseTitle",
          colId: "courseTitle",
          filter: "agSetColumnFilter",
          filterParams: {
            defaultToNothingSelected: true,
            suppressSelectAll: true,
          },
        },
        {
          headerName: "Section",
          field: "Section",
          filter: "agSetColumnFilter",
          filterParams: {
            defaultToNothingSelected: true,
            suppressSelectAll: true,
          },
        },
        {
          headerName: "Days",
          field: "ClassPattern",
          filter: "agSetColumnFilter",
          filterParams: {
            defaultToNothingSelected: true,
            suppressSelectAll: true,
          },
        },
        {
          headerName: "StartTime",
          field: "MtgStart",
          valueGetter: TimeValueGetter,
          filter: "agSetColumnFilter",
          filterParams: {
            defaultToNothingSelected: true,
            suppressSelectAll: true,
          },
        },
        {
          headerName: "End Time",
          field: "EndTime",
          filter: "agSetColumnFilter",
          filterParams: {
            defaultToNothingSelected: true,
            suppressSelectAll: true,
          },
        },
        {
          headerName: "Instructor ID",
          field: "InstructorID",
          filter: "agSetColumnFilter",
          filterParams: {
            defaultToNothingSelected: true,
            suppressSelectAll: true,
          },
        },
        {
          headerName: "Instructor",
          field: "DisplayName",
          filter: "agSetColumnFilter",
          filterParams: {
            defaultToNothingSelected: true,
            suppressSelectAll: true,
          },
        },
        {
          headerName: "Degree",
          field: "Career",
          filter: "agSetColumnFilter",
          filterParams: {
            defaultToNothingSelected: true,
            suppressSelectAll: true,
          },
        },
      ],
      defaultColDef: {
        flex: 1,
        minWidth: 130,
        wrap: true,
        resizable: false,
        floatingFilter: true,
      },
      headerName: "Name",
      rowSelection: "single",
      rowData: null,
    };
  }
  
  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const updateData = (data) => {
      this.setState({ rowData: data });
    };

    fetch("http://myjson.dit.upm.es/api/bins/1kzm")
      .then((resp) => resp.json())
      .then((data) => updateData(data));
  };

  onSelectionChanged = () => {
    var selectedRows = this.gridApi.getSelectedRows();
    this.setState({
      subject: selectedRows[0].Subject + " " + selectedRows[0].Catalog,
      instructor: selectedRows[0].DisplayName,
      code: selectedRows[0].Catalog,
      title: selectedRows[0].CourseTitle,
      section: selectedRows[0].Section,
      startTime: selectedRows[0].MtgStart,
      endTime: selectedRows[0].EndTime,
      classPattern: selectedRows[0].ClassPattern,
    });
  };

  headerHeightSetter() {
    var padding = 20;
    var height = padding;
    this.api.setHeaderHeight(height);
    this.api.resetRowHeights();
  }
  componentDidMount() {
    document
    .querySelectorAll('[unselectable="on"]')
    .forEach(
      (el) => (
        el.removeAttribute("unselectable"), (el.style.cssText = "none")
        )
      );
      this.setState({
      startDate: "2021-10-11",
      events: [],
    });
  }
  onActionComplete(){
    this.appendElement('Schedule <b>Action Complete</b> event called<hr>');
  }

  onRenderCell(args) {
    if (args.elementType === "dateHeader" || args.elementType === "monthCells") {
        removeClass(args.element.childNodes, "e-navigate");
    }
}

  onButtonClick() {
    data.push({
      Id:this.state.id+1,
      Subject:this.state.subject,
      IsAllDay:false,
      StartTime: this.state.sTime,
      EndTime: this.state.eTime
    })
    this.setState({id:this.state.id+1})
    console.log(data)
    this.onActionComplete.bind(data);
  }

  onPopupOpen(args) {
    args.cancel = true;
  }

  getDate() {
    const dp = this.calendar;
    var Time = this.state.startTime.substring(
      this.state.startTime.length - 2,
      this.state.startTime.length
    );
    var startHour=1;
    var startMin=1;
    var startTime = this.state.startTime.substring(
      0,
      this.state.startTime.indexOf(":")
    );
    if (Time === "AM") {
      startHour=parseInt(startTime);
      startMin=parseInt(this.state.startTime.substring(
        this.state.startTime.indexOf(":")+1,
        this.state.startTime.indexOf(":") + 3
      ))
    } else {
      if (startTime === "12") {
        startHour=parseInt(startTime);
      startMin=parseInt(this.state.startTime.substring(
        this.state.startTime.indexOf(":")+1,
        this.state.startTime.indexOf(":") + 3
      ))
      } else {
          startHour= (parseInt(startTime) + 12).toString() ;
      startMin=parseInt(this.state.startTime.substring(
        this.state.startTime.indexOf(":")+1,
        this.state.startTime.indexOf(":") + 3
      ))
      }
    }
    Time = this.state.endTime.substring(
      this.state.endTime.length - 2,
      this.state.endTime.length
    );
    var endHour = 1;
    var endMin = 1;
    var endTime = this.state.endTime.substring(
      0,
      this.state.endTime.indexOf(":")
    );
    if (Time === "AM") {
      endHour=parseInt(endTime);
      endMin=parseInt(this.state.endTime.substring(
        this.state.endTime.indexOf(":")+1,
        this.state.endTime.indexOf(":") + 3
      ))
    } else {
      if (endTime === "12") {
        endHour=parseInt(endTime);
      endMin=parseInt(this.state.endTime.substring(
        this.state.endTime.indexOf(":")+1,
        this.state.endTime.indexOf(":") + 3
      ))
      } else {
          endHour= (parseInt(endTime) + 12) ;
      endMin=parseInt(this.state.endTime.substring(
        this.state.endTime.indexOf(":")+1,
        this.state.endTime.indexOf(":") + 3
      ))
      }
    }
    var day=1;
    for (var i = 0; i < this.state.classPattern.length; i++) {
      if (this.state.classPattern.substring(i, i + 1) === "M") {
        day=12;
      }
      if (this.state.classPattern.substring(i, i + 1) === "T" && this.state.classPattern.substring(i, i + 2) !== "TH") {
        day=13;
      }
      if (this.state.classPattern.substring(i, i + 1) === "W") {
        day=14;
      }
      if (this.state.classPattern.substring(i, i + 1) === "F") {
        day=16;
      }
      if (this.state.classPattern.substring(i, i + 1) === "S") {
        day=17;
      }
      if (this.state.classPattern.substring(i, i + 2) === "TH") {
        day=15;
        i+=1;
      }
      this.setState({
        sTime:(new Date(2018, 1, day, startHour, endMin)) , eTime:(new Date(2018, 1, day, endHour, endMin))
      });
      var startDate=new Date(2018, 1, day, startHour, startMin)
      var endDate=new Date(2018, 1, day, endHour, endMin)
      var Data=[{
        Id:this.state.id+1,
        Subject:this.state.subject,
        IsAllDay:false,
        StartTime:startDate,
        EndTime:endDate,
      }]
      console.log(data);
      this.scheduleObj.addEvent(Data);
      this.onActionComplete.bind(data);
    }
    this.setState({id:this.state.id+1})
  }
  
  addEvent(){
    this.scheduleObj.addEvent(data);

  }
  appendElement(html) {
    let span = document.createElement('span');
    span.innerHTML = html;
    let log = document.getElementById('EventLog');
    log.insertBefore(span, log.firstChild);
  }
  onAddClick() {
    let Data = [{
            Id: 1,
            Subject: 'Conference',
            StartTime: new Date(2018, 1, 12, 9, 0),
            EndTime: new Date(2018, 1, 12, 10, 0),
            IsAllDay: false
        }, {
            Id: 2,
            Subject: 'Meeting',
            StartTime: new Date(2018, 1, 15, 10, 0),
            EndTime: new Date(2018, 1, 15, 11, 30),
            IsAllDay: false
        }];
    this.scheduleObj.addEvent(Data);
}
onDeleteClick() {
  this.scheduleObj.deleteEvent(this.state.delId);
  // this.buttonObj.element.setAttribute('disabled', 'true');
}

onEventClick(args) {
  var dataId = args.element.attributes[1].value;
  console.log(dataId.substring(dataId.indexOf("_")+1))
  var id=parseInt(dataId.substring(dataId.indexOf("_")+1));
  this.setState({delId:id})  
}
  render() {
    var { ...config } = this.state;
    return (
      <div>
        <div style={styles.wrap}>
            <div style={styles.left}
              id="myGrid"
              style={{
                height: "630px",
                width: "400000px",
              }}
              className="ag-theme-balham grid"
            >
              <AgGridReact
                modules={this.state.modules}
                columnDefs={this.state.columnDefs}
                defaultColDef={this.state.defaultColDef}
                rowSelection={this.state.rowSelection}
                onGridReady={this.onGridReady}
                rowData={this.state.rowData}
                onSelectionChanged={this.onSelectionChanged.bind(this)}
                onFirstDataRendered={this.headerHeightSetter}
              />
          <button onClick={() => this.getDate()}>Add Course</button>
          <button onClick={() => {this.onDeleteClick()}}>Delete Course</button>
            </div>
          <div
            
            className="calendar"
          >
            <div className="calendarContainer">
              <div className="main_calendar" style={
              styles.main,
              {

              }
            }>
                <ScheduleComponent
                ref={t => this.scheduleObj = t}
                  height="630px"
                  selectedDate={new Date(2018, 1, 15)}
                  showHeaderBar={false}
                  showTimeIndicator={false}
                  eventClick={this.onEventClick.bind(this)}
                  renderCell={this.onRenderCell.bind(this)}
                  eventSettings={{
                    dataSource: data,
                    fields: {
                      id: "Id",
                      subject: { name: "Subject" },
                      isAllDay: { name: "IsAllDay" },
                      startTime: { name: "StartTime" },
                      endTime: { name: "EndTime" },
                    },
                  }}
                  popupOpen={this.onPopupOpen.bind(this)}
                >
                  <Inject services={[ Week ]} />
                </ScheduleComponent>
              </div>
            </div>
          </div>
          {/* <ContextMenuComponent ref={menu => this.menuObj = menu} select={this.onMenuItemSelect.bind(this)}/> */}
        </div>
      </div>
    );
  }
}
function abValueGetter(params) {
  return params.data.Subject + " " + params.data.Catalog;
}
function TimeValueGetter(params) {
  if (params.data.MtgStart !== "") {
    return params.data.MtgStart;
  }
}

export default Calendar;
