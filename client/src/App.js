import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home, PageNotFound } from './pages';

const router = createBrowserRouter([{path:'/', element:<Home/>, errorElement: <PageNotFound/>}])

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
