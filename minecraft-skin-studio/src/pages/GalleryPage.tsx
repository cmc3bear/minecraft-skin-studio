import { Link, useNavigate } from 'react-router-dom';
import { SkinProject } from '../types';
import '../styles/GalleryPage.css';

interface GalleryPageProps {
  projects: SkinProject[];
  onDelete: (id: string) => void;
}

function GalleryPage({ projects, onDelete }: GalleryPageProps) {
  const navigate = useNavigate();

  const handleEdit = (id: string) => {
    navigate(`/editor/${id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this skin?')) {
      onDelete(id);
    }
  };

  return (
    <div className="gallery-page">
      <header className="gallery-header">
        <Link to="/" className="back-button" aria-label="Go back to home page">← Home</Link>
        <h1>My Skins</h1>
        <Link to="/editor" className="new-button" aria-label="Create new skin">+ New Skin</Link>
      </header>
      
      <div className="gallery-content" role="main">
        {projects.length === 0 ? (
          <div className="empty-gallery" role="status" aria-live="polite">
            <p>You haven't created any skins yet!</p>
            <Link to="/editor" className="create-first" aria-label="Create your first skin">Create your first skin</Link>
          </div>
        ) : (
          <div className="skins-grid" role="list" aria-label="Your saved skins">
            {projects.map(project => (
              <div key={project.id} className="skin-card" role="listitem">
                <div className="skin-preview">
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt={`Preview of ${project.name}`} />
                  ) : (
                    <div className="placeholder-thumbnail" aria-label="No preview available">🎨</div>
                  )}
                </div>
                <h3>{project.name}</h3>
                <p className="skin-date">
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </p>
                <div className="skin-actions">
                  <button 
                    onClick={() => handleEdit(project.id)}
                    className="edit-button"
                    aria-label={`Edit ${project.name}`}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(project.id)}
                    className="delete-button"
                    aria-label={`Delete ${project.name}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GalleryPage;