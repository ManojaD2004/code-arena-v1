"use client";
import React, { useEffect, useState } from "react";
import { cn } from "../../utils/cn";

const data = {
  title: "Documentation for Volatility UI Framework",
  sections: [
    {
      title: "Introduction",
      content:
        "Here you will find the documentation for the Volatility UI Framework. The goal of this project is to create an intuitive online interface for the Volatility framework, an efficient memory forensics and analysis tool. You will find instructions for installation, configuration, usage, and development in this documentation.t.",
    },
    {
      title: "Get Started",
      subsections: [
        {
          title: "Requirements",
          content: "Volatility Framework installed and accessible",
        },
        {
          title: "Installation",
          steps: [
            "Clone the Repository:\nbash\ngit clone https://github.com/yourusername/volatility-ui-framework.git\ncd volatility-ui-framework\n",
            "Backend Setup:\nbash\ncd backend\npython -m venv venv\nsource venv/bin/activate\npip install -r requirements.txt\n",
          ],
        },
        {
          title: "Configuration",
          steps: [
            "Backend Configuration:\n- Create a .env file in the backend directory with necessary environment variables (e.g., database connection strings, secret keys).\n\nenv\nDATABASE_URL=your_database_url\nSECRET_KEY=your_secret_key\n",
            "Frontend Configuration:\n- Create a .env file in the frontend directory with necessary environment variables (e.g., API endpoint).\n\nenv\nREACT_APP_API_URL=http://localhost:8000/api\n",
          ],
        },
      ],
    },
    {
      title: "User Guide",
      subsections: [
        {
          title: "Logging In",
          steps: [
            "Navigate to the login page.",
            "Enter your username and password.",
            'Click on the "Login" button.',
          ],
        },

        {
          title: "Creating an Analysis Task",
          steps: [
            'Click on the "Plugins" button.',
            "Select the desired plugin for memory analysis.",
            "Upload the memory dump file.",
            'Click "Submit" to start the analysis.',
          ],
        },
        {
          title: "Viewing Results",
          steps: ['Navigate to the "Results" section.'],
        },
        {
          title: "Managing Historical Data",
          steps: [
            'Navigate to the "History" section.',
            "View and manage past analysis tasks and results.",
          ],
        },
      ],
    },
    {
      title: "API Reference",
      subsections: [
        {
          title: "Authentication Endpoints",
          endpoints: [
            {
              method: "POST",
              url: "/api/register",
              description: "Register a new user.",
              requestBody: '{ "username": "string", "password": "string" }',
            },
            {
              method: "POST",
              url: "/api/login",
              description: "Authenticate a user and issue a token.",
              requestBody: '{ "username": "string", "password": "string" }',
            },
            {
              method: "POST",
              url: "/api/logout",
              description: "Logout a user.",
            },
          ],
        },
        {
          title: "Analysis Task Endpoints",
          endpoints: [
            {
              method: "POST",
              url: "/api/tasks",
              description: "Create a new analysis task.",
              requestBody: '{ "memory_dump": "file", "rules": "string" }',
            },
            {
              method: "GET",
              url: "/api/tasks",
              description:
                "List all analysis tasks for the authenticated user.",
            },
            {
              method: "GET",
              url: "/api/tasks/{task_id}",
              description: "Retrieve details of a specific analysis task.",
            },
            {
              method: "DELETE",
              url: "/api/tasks/{task_id}",
              description: "Delete an analysis task.",
            },
          ],
        },
        {
          title: "Results Endpoints",
          endpoints: [
            {
              method: "GET",
              url: "/api/tasks/{task_id}/results",
              description: "Retrieve results of a specific analysis task.",
            },
          ],
        },
      ],
    },

    {
      title: "REST APIs",
      endpoints: [
        {
          title: "Upload Memory Dump",
          method: "POST",
          url: "/api/memory-dump",
          description: "Uploads a memory dump file for analysis.",
          requestBody: '{ "file": <memory_dump_file> }',
          response: '{ "status": "success", "fileId": <file_id> }',
        },
        {
          title: "Start Memory Analysis",
          method: "POST",
          url: "/api/analyze",
          description: "Initiates memory analysis using a specified plugin.",
          requestBody: '{ "fileId": <file_id>, "plugin": <plugin_name> }',
          response:
            '{ "status": "analysis_started", "analysisId": <analysis_id> }',
        },
        {
          title: "Get Analysis Status",
          method: "GET",
          url: "/api/analysis/{analysisId}/status",
          description: "Retrieves the status of an ongoing memory analysis.",
          response: '{ "status": "in_progress" | "completed" | "failed" }',
        },
        {
          title: "Get Analysis Results",
          method: "GET",
          url: "/api/analysis/{analysisId}/results",
          description: "Fetches the results of a completed memory analysis.",
          response: '{ "status": "success", "results": <analysis_results> }',
        },
        {
          title: "List Historical Analyses",
          method: "GET",
          url: "/api/analyses",
          description: "Lists all historical analyses performed by the user.",
          response:
            '{ "analyses": [ { "analysisId": <id>, "date": <timestamp>, "plugin": <plugin_name> } ] }',
        },
      ],
    },

    {
      title: "Contact",
      content:
        "contact us [abcd@xyz.com] or visit our GitHub repository (https://github.com/ManojaD2004/code-arena-v1.git).",
    },
  ],
};

const Cardy = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    async function getData() {
      const res = await fetch(
        "http://localhost:5000/api/analyses?userid=manojadkc2004@gmail.com",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res1 = await res.json();
      console.log(res1);
      setData(res1.analyses);
    }
    // getData();
  }, []);
  return (
    <div className="">
      {data.map((ele) => (
        <Card className="flex gap-[90px] mt-9">
          <div>
            <a
              target="_blank"
              href={`http://localhost:3000/analysis/${ele.id}`}
            >
              <CardTitle>{ele.id}</CardTitle>
            </a>
            <CardDescription>{ele.analysis_status}</CardDescription>
            <CardDescription>{ele.date_time}</CardDescription>
          </div>
        </Card>
      ))}
      {/* <Card className="flex gap-[90px]">
        <div>
          <CardTitle>tiger hollo</CardTitle>
          <CardDescription>hello kitty</CardDescription>
          <CardDescription>hello kitty</CardDescription>
        </div>
      </Card> */}
    </div>
  );
};

export default Cardy;

export const Card = ({ className, children }) => {
  return (
    <div
      className={cn(
        "max-w-[1200px] w-full mx-auto p-8 rounded-xl border border-gray-600  bg-white shadow-[2px 4px 16px 0px rgba(248,248,248,0.06) inset] group",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className }) => {
  return (
    <h3
      className={cn(
        "text-lg font-medium text-black dark:text-black py-2",
        className
      )}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className }) => {
  return (
    <p
      className={cn(
        "text-sm font-normal text-black dark:text-black max-w-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
