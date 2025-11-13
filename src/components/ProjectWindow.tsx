import "./ProjectWindow.css";

type Project = {
    title: string;
    description: string;
    img: string;
    skills: string[];
    tools: { name: string; icon: React.ReactNode }[];
    links: { label: string; url: string; icon: React.ReactNode }[];
};

type ProjectWindowProps = {
    open: boolean;
    onClose: () => void;
    project: Project;
};

export default function ProjectWindow({ open, onClose, project }: ProjectWindowProps) {
    if (!open) return null; // don't render unless open

    return (
        <div className="project-window-overlay" onClick={onClose}>
            <div
                className="project-window"
                onClick={e => e.stopPropagation()} // Prevent close when clicking inside window
            >
                <div className="window-header">
                    <span>{project.title}</span>
                    <button className="close-btn" onClick={onClose}>✖</button>
                </div>
                <div className="window-content">
                    <img className="window-img" src={project.img} alt={project.title + " preview"} />
                    <div className="window-desc">{project.description}</div>
                    <div className="window-subsection">
                        <strong>Skills:</strong>
                        <ul>
                            {project.skills.map(s =>
                                <li key={s}>{s}</li>
                            )}
                        </ul>
                    </div>
                    <div className="window-subsection">
                        <strong>Tools Used:</strong>
                        <div className="window-tools">
                            {project.tools.map(tool =>
                                    <span className="window-tool" key={tool.name}>
                   {tool.icon}<span style={{ marginLeft: "0.5em" }}>{tool.name}</span>
                </span>
                            )}
                        </div>
                    </div>
                    <div className="window-links">
                        {project.links.map(link =>
                            <a href={link.url} target="_blank" rel="noopener noreferrer"
                               className="icon-circle cursor-target"
                               key={link.label}
                               title={link.label}>
                                {link.icon}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}