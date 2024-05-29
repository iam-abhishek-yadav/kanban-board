import React, { useState } from "react";

interface Task {
	id: number;
	title: string;
	description: string;
}

interface Tasks {
	todo: Task[];
	inProgress: Task[];
	done: Task[];
}

const initialTasks: Tasks = {
	todo: [
		{ id: 1, title: "Task 1", description: "Description for Task 1" },
		{ id: 2, title: "Task 2", description: "Description for Task 2" },
		{ id: 3, title: "Task 3", description: "Description for Task 3" },
	],
	inProgress: [
		{ id: 4, title: "Task 4", description: "Description for Task 4" },
		{ id: 5, title: "Task 5", description: "Description for Task 5" },
	],
	done: [
		{ id: 6, title: "Task 6", description: "Description for Task 6" },
		{ id: 7, title: "Task 7", description: "Description for Task 7" },
	],
};

const App: React.FC = () => {
	const [tasks, setTasks] = useState<Tasks>(initialTasks);
	const [showModal, setShowModal] = useState(false);
	const [newTask, setNewTask] = useState<Task>({
		id: 0,
		title: "",
		description: "",
	});

	const moveTask = (
		id: number,
		source: keyof Tasks,
		destination: keyof Tasks
	) => {
		const task = tasks[source].find((task) => task.id === id);
		if (!task) return;

		const newSourceTasks = tasks[source].filter((task) => task.id !== id);
		const newDestinationTasks = [...tasks[destination], task];

		setTasks((prevTasks) => ({
			...prevTasks,
			[source]: newSourceTasks,
			[destination]: newDestinationTasks,
		}));
	};

	const handleDragStart = (id: number, source: keyof Tasks) => {
		return (event: React.DragEvent<HTMLDivElement>) => {
			event.dataTransfer.setData("id", id.toString());
			event.dataTransfer.setData("source", source);
		};
	};

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
	};

	const handleDrop = (destination: keyof Tasks) => {
		return (event: React.DragEvent<HTMLDivElement>) => {
			const id = +event.dataTransfer.getData("id");
			const source = event.dataTransfer.getData("source") as keyof Tasks;

			if (destination !== source) {
				moveTask(id, source, destination);
			}
		};
	};

	const handleAddTask = () => {
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setNewTask({ id: 0, title: "", description: "" });
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setNewTask((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleAddNewTask = () => {
		const id = Date.now();
		setTasks((prevTasks) => ({
			...prevTasks,
			todo: [...prevTasks.todo, { ...newTask, id }],
		}));
		handleCloseModal();
	};

	return (
		<div>
			<button
				onClick={handleAddTask}
				className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 ml-4'>
				Add Task
			</button>
			{showModal && (
				<div className='fixed inset-0 flex items-center justify-center'>
					<div className='modal-overlay absolute w-full h-full bg-gray-900 opacity-50'></div>
					<div className='modal-container bg-white w-1/3 rounded-lg shadow-lg z-50 relative'>
						<button
							onClick={handleCloseModal}
							className='absolute top-0 right-0 m-4 text-black font-semibold text-lg cursor-pointer'>
							X
						</button>
						<div className='p-4'>
							<h2 className='text-lg font-semibold mb-4'>Add New Task</h2>
							<input
								type='text'
								name='title'
								placeholder='Title'
								value={newTask.title}
								onChange={handleInputChange}
								className='block w-full p-2 mb-2 border border-gray-300 rounded-md'
							/>
							<textarea
								name='description'
								placeholder='Description'
								value={newTask.description}
								onChange={handleInputChange}
								className='block w-full p-2 mb-4 border border-gray-300 rounded-md'></textarea>
							<button
								onClick={handleAddNewTask}
								className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
								Add Task
							</button>
						</div>
					</div>
				</div>
			)}
			<div className='flex justify-center space-x-8 mt-8'>
				<div
					className='border rounded-lg p-4 w-1/4'
					onDragOver={handleDragOver}
					onDrop={handleDrop("todo")}>
					<h2 className='text-center text-xl font-bold mb-4'>Todo</h2>
					{tasks.todo.map((task) => (
						<div
							key={task.id}
							className='task-card bg-gray-200 rounded-md shadow-md mb-4 cursor-pointer'
							draggable
							onDragStart={handleDragStart(task.id, "todo")}>
							<h3 className='text-lg font-semibold mb-2'>{task.title}</h3>
							<p>{task.description}</p>
						</div>
					))}
				</div>
				<div
					className='border rounded-lg p-4 w-1/4'
					onDragOver={handleDragOver}
					onDrop={handleDrop("inProgress")}>
					<h2 className='text-center text-xl font-bold mb-4'>In Progress</h2>
					{tasks.inProgress.map((task) => (
						<div
							key={task.id}
							className='task-card bg-gray-200 rounded-md shadow-md mb-4 cursor-pointer'
							draggable
							onDragStart={handleDragStart(task.id, "inProgress")}>
							<h3 className='text-lg font-semibold mb-2'>{task.title}</h3>
							<p>{task.description}</p>
						</div>
					))}
				</div>
				<div
					className='border rounded-lg p-4 w-1/4'
					onDragOver={handleDragOver}
					onDrop={handleDrop("done")}>
					<h2 className='text-center text-xl font-bold mb-4'>Done</h2>
					{tasks.done.map((task) => (
						<div
							key={task.id}
							className='task-card bg-gray-200 rounded-md shadow-md mb-4 cursor-pointer'
							draggable
							onDragStart={handleDragStart(task.id, "done")}>
							<h3 className='text-lg font-semibold mb-2'>{task.title}</h3>
							<p>{task.description}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default App;
