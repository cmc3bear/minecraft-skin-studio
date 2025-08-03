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
        <Link to="/" className="back-button">← Home</Link>
        <h1>My Skins</h1>
        <Link to="/editor" className="new-button">+ New Skin</Link>
      </header>
      
      <div className="gallery-content">
        {projects.length === 0 ? (
          <div className="empty-gallery">
            <p>You haven't created any skins yet!</p>
            <Link to="/editor" className="create-first">Create your first skin</Link>
          </div>
        ) : (
          <div className="skins-grid">
            {projects.map(project => (
              <div key={project.id} className="skin-card">
                <div className="skin-preview">
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt={project.name} />
                  ) : (
                    <div className="placeholder-thumbnail">🎨</div>
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
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(project.id)}
                    className="delete-button"
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