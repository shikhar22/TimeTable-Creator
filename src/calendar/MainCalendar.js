import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
} from "@syncfusion/ej2-react-schedule";
import Calendar from "../calendar/Calendar";
const MainCalendar = () => {
  var data = [
    {
      Id: 2,
      Subject: "Meeting",
      StartTime: new Date(2018, 1, 15, 10, 0),
      EndTime: new Date(2018, 1, 15, 12, 30),
      IsAllDay: false,
    },
    {
      Id: 3,
      Subject: "Kuchh nhi",
      StartTime: new Date(2018, 1, 13, 10, 0),
      EndTime: new Date(2018, 1, 13, 11, 30),
      IsAllDay: false,
    },
  ];
  return (
    <ScheduleComponent
      height="600px"
      selectedDate={new Date(2018, 1, 15)}
      showHeaderBar={false}
      eventSettings={{
        dataSource: Calendar.data,
        fields: {
          id: "Id",
          subject: { name: "Subject" },
          isAllDay: { name: "IsAllDay" },
          startTime: { name: "StartTime" },
          endTime: { name: "EndTime" },
        },
      }}
      // popupOpen={this.onPopupOpen.bind(this)}
    >
      <Inject services={[Week]} />
    </ScheduleComponent>
  );
};
export default MainCalendar;
