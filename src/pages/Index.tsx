import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

type ProjectStatus = 'planning' | 'active' | 'completed' | 'closed';
type MaterialCategory = 'metal' | 'wood' | 'plastic' | 'electronics' | 'consumables';

interface Project {
  id: string;
  name: string;
  number: string;
  status: ProjectStatus;
  deadline: string;
  progress: number;
  responsible: string;
}

interface Material {
  id: string;
  name: string;
  article: string;
  category: MaterialCategory;
  unit: string;
  totalStock: number;
  reserved: number;
  minStock: number;
}

interface WarehouseOperation {
  id: string;
  type: 'receipt' | 'transfer' | 'issue' | 'writeoff';
  date: string;
  material: string;
  quantity: number;
  warehouse: string;
  user: string;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'projects' | 'materials' | 'warehouse' | 'reports' | 'settings'>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory | 'all'>('all');
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({
    name: '',
    status: 'planning' as ProjectStatus,
    deadline: '',
    responsible: ''
  });
  const { toast } = useToast();

  useState<Project[]>([
    { id: '1', name: 'Производство серии А-100', number: 'PRJ-2026-001', status: 'active', deadline: '2026-02-15', progress: 65, responsible: 'Иванов И.И.' },
    { id: '2', name: 'Модернизация линии №3', number: 'PRJ-2026-002', status: 'planning', deadline: '2026-03-01', progress: 25, responsible: 'Петрова А.С.' },
    { id: '3', name: 'Опытная партия Б-50', number: 'PRJ-2026-003', status: 'active', deadline: '2026-02-20', progress: 80, responsible: 'Сидоров П.В.' },
    { id: '4', name: 'Ремонт оборудования цех №2', number: 'PRJ-2026-004', status: 'completed', deadline: '2026-01-25', progress: 100, responsible: 'Кузнецова М.А.' },
  ]);

  const projects = projectsList;

  const materials: Material[] = [
    { id: '1', name: 'Сталь листовая 3мм', article: 'STL-003', category: 'metal', unit: 'м²', totalStock: 450, reserved: 120, minStock: 100 },
    { id: '2', name: 'Профиль алюминиевый 40x40', article: 'ALU-4040', category: 'metal', unit: 'м', totalStock: 85, reserved: 60, minStock: 50 },
    { id: '3', name: 'Фанера берёзовая 18мм', article: 'PLY-018', category: 'wood', unit: 'м²', totalStock: 30, reserved: 25, minStock: 40 },
    { id: '4', name: 'Пластик ABS чёрный', article: 'ABS-BLK', category: 'plastic', unit: 'кг', totalStock: 180, reserved: 40, minStock: 50 },
    { id: '5', name: 'Контроллер Arduino Mega', article: 'ARD-MEGA', category: 'electronics', unit: 'шт', totalStock: 12, reserved: 8, minStock: 15 },
    { id: '6', name: 'Болты М8x25', article: 'BLT-M8-25', category: 'consumables', unit: 'шт', totalStock: 2400, reserved: 500, minStock: 1000 },
  ];

  const recentOperations: WarehouseOperation[] = [
    { id: '1', type: 'receipt', date: '2026-01-30 14:25', material: 'Сталь листовая 3мм', quantity: 150, warehouse: 'Основной склад', user: 'Склад1' },
    { id: '2', type: 'issue', date: '2026-01-30 12:10', material: 'Профиль алюминиевый 40x40', quantity: 20, warehouse: 'Цех производства', user: 'Мастер1' },
    { id: '3', type: 'transfer', date: '2026-01-30 10:05', material: 'Пластик ABS чёрный', quantity: 35, warehouse: 'Склад → Цех', user: 'Склад1' },
    { id: '4', type: 'receipt', date: '2026-01-29 16:40', material: 'Контроллер Arduino Mega', quantity: 10, warehouse: 'Основной склад', user: 'Склад2' },
    { id: '5', type: 'writeoff', date: '2026-01-29 13:15', material: 'Болты М8x25', quantity: 150, warehouse: 'Основной склад', user: 'Мастер2' },
  ];

  const getStatusIcon = (status: ProjectStatus) => {
    switch (status) {
      case 'planning': return 'FileText';
      case 'active': return 'Play';
      case 'completed': return 'CheckCircle2';
      case 'closed': return 'Archive';
    }
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'planning': return 'bg-yellow-500';
      case 'active': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'closed': return 'bg-gray-400';
    }
  };

  const getStatusText = (status: ProjectStatus) => {
    switch (status) {
      case 'planning': return 'Планирование';
      case 'active': return 'Активен';
      case 'completed': return 'Завершён';
      case 'closed': return 'Закрыт';
    }
  };

  const getOperationIcon = (type: WarehouseOperation['type']) => {
    switch (type) {
      case 'receipt': return 'PackagePlus';
      case 'transfer': return 'ArrowRightLeft';
      case 'issue': return 'PackageMinus';
      case 'writeoff': return 'Trash2';
    }
  };

  const getOperationColor = (type: WarehouseOperation['type']) => {
    switch (type) {
      case 'receipt': return 'text-green-600';
      case 'transfer': return 'text-blue-600';
      case 'issue': return 'text-orange-600';
      case 'writeoff': return 'text-red-600';
    }
  };

  const getStockStatus = (material: Material) => {
    const available = material.totalStock - material.reserved;
    if (available < material.minStock) return { status: 'critical', color: 'text-red-600', icon: 'AlertTriangle' };
    if (available < material.minStock * 1.5) return { status: 'warning', color: 'text-yellow-600', icon: 'AlertCircle' };
    return { status: 'ok', color: 'text-green-600', icon: 'CheckCircle2' };
  };

  const getCategoryIcon = (category: MaterialCategory) => {
    switch (category) {
      case 'metal': return 'Hammer';
      case 'wood': return 'Trees';
      case 'plastic': return 'Box';
      case 'electronics': return 'Cpu';
      case 'consumables': return 'Package';
    }
  };

  const getCategoryName = (category: MaterialCategory) => {
    switch (category) {
      case 'metal': return 'Металл';
      case 'wood': return 'Древесина';
      case 'plastic': return 'Пластик';
      case 'electronics': return 'Электроника';
      case 'consumables': return 'Расходники';
    }
  };

  const filteredMaterials = selectedCategory === 'all' 
    ? materials 
    : materials.filter(m => m.category === selectedCategory);

  const criticalMaterials = materials.filter(m => {
    const available = m.totalStock - m.reserved;
    return available < m.minStock;
  });

  const activeProjects = projects.filter(p => p.status === 'active').length;

  const handleCreateProject = () => {
    if (!newProject.name.trim() || !newProject.deadline || !newProject.responsible.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    const projectNumber = `PRJ-2026-${String(projects.length + 1).padStart(3, '0')}`;
    const newProjectData: Project = {
      id: String(Date.now()),
      name: newProject.name,
      number: projectNumber,
      status: newProject.status,
      deadline: newProject.deadline,
      progress: 0,
      responsible: newProject.responsible
    };

    setProjectsList([...projects, newProjectData]);
    setIsCreateProjectOpen(false);
    setNewProject({ name: '', status: 'planning', deadline: '', responsible: '' });
    
    toast({
      title: 'Проект создан',
      description: `${projectNumber}: ${newProject.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm z-50">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Icon name="Package" className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">СкладПро</h1>
              <p className="text-xs text-gray-500">Управление материалами</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {[
            { id: 'dashboard', icon: 'LayoutDashboard', label: 'Приборная панель' },
            { id: 'projects', icon: 'Briefcase', label: 'Проекты' },
            { id: 'materials', icon: 'Package', label: 'Материалы' },
            { id: 'warehouse', icon: 'Warehouse', label: 'Склад' },
            { id: 'reports', icon: 'BarChart3', label: 'Отчёты' },
            { id: 'settings', icon: 'Settings', label: 'Настройки' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === item.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon name={item.icon} size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <Icon name="User" size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Администратор</p>
              <p className="text-xs text-gray-500">admin@skladpro.ru</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="ml-64 p-8">
        {activeSection === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Приборная панель</h2>
              <p className="text-gray-500 mt-1">Обзор текущей ситуации на складе и в производстве</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Активные проекты</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">{activeProjects}</p>
                      <p className="text-xs text-gray-500 mt-1">из {projects.length} всего</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon name="Briefcase" className="text-blue-600" size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Критичные дефициты</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-red-600">{criticalMaterials.length}</p>
                      <p className="text-xs text-gray-500 mt-1">ниже минимума</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Icon name="AlertTriangle" className="text-red-600" size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Всего материалов</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">{materials.length}</p>
                      <p className="text-xs text-gray-500 mt-1">в номенклатуре</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Icon name="Package" className="text-green-600" size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Операций сегодня</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">{recentOperations.length}</p>
                      <p className="text-xs text-gray-500 mt-1">за последние 24ч</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Icon name="TrendingUp" className="text-yellow-600" size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="AlertTriangle" className="text-red-600" size={20} />
                    Критичные дефициты
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80">
                    <div className="space-y-4">
                      {criticalMaterials.map((material) => {
                        const available = material.totalStock - material.reserved;
                        const shortage = material.minStock - available;
                        return (
                          <div key={material.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{material.name}</p>
                              <p className="text-sm text-gray-600">Артикул: {material.article}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-red-600">Нехватка: {shortage} {material.unit}</p>
                              <p className="text-xs text-gray-500">Доступно: {available} из {material.minStock}</p>
                            </div>
                          </div>
                        );
                      })}
                      {criticalMaterials.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Icon name="CheckCircle2" size={48} className="mx-auto mb-2 text-green-500" />
                          <p>Все материалы в норме</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Activity" className="text-blue-600" size={20} />
                    Последние операции
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80">
                    <div className="space-y-3">
                      {recentOperations.map((op) => (
                        <div key={op.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            op.type === 'receipt' ? 'bg-green-100' :
                            op.type === 'transfer' ? 'bg-blue-100' :
                            op.type === 'issue' ? 'bg-orange-100' : 'bg-red-100'
                          }`}>
                            <Icon name={getOperationIcon(op.type)} className={getOperationColor(op.type)} size={20} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{op.material}</p>
                            <p className="text-sm text-gray-600">{op.warehouse}</p>
                            <p className="text-xs text-gray-500 mt-1">{op.date} • {op.user}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className={getOperationColor(op.type)}>
                              {op.type === 'receipt' ? '+' : '-'}{op.quantity}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeSection === 'projects' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Проекты</h2>
                <p className="text-gray-500 mt-1">Управление производственными проектами</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsCreateProjectOpen(true)}>
                <Icon name="Plus" size={20} className="mr-2" />
                Создать проект
              </Button>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">Все проекты ({projects.length})</TabsTrigger>
                <TabsTrigger value="active">Активные ({projects.filter(p => p.status === 'active').length})</TabsTrigger>
                <TabsTrigger value="planning">Планирование ({projects.filter(p => p.status === 'planning').length})</TabsTrigger>
                <TabsTrigger value="completed">Завершённые ({projects.filter(p => p.status === 'completed').length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {projects.map((project) => (
                    <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl">{project.name}</CardTitle>
                            <p className="text-sm text-gray-500 mt-1">{project.number}</p>
                          </div>
                          <Badge className={`${getStatusColor(project.status)} text-white`}>
                            <Icon name={getStatusIcon(project.status)} size={14} className="mr-1" />
                            {getStatusText(project.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Прогресс</span>
                            <span className="font-medium text-gray-900">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Icon name="Calendar" size={16} />
                            <span>Дедлайн: {new Date(project.deadline).toLocaleDateString('ru-RU')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Icon name="User" size={16} />
                            <span>{project.responsible}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Icon name="Eye" size={16} className="mr-2" />
                            Открыть
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Icon name="Edit" size={16} className="mr-2" />
                            Редактировать
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {activeSection === 'materials' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Материалы</h2>
                <p className="text-gray-500 mt-1">Номенклатура материалов и остатки</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Icon name="Upload" size={20} className="mr-2" />
                  Импорт CSV
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Icon name="Plus" size={20} className="mr-2" />
                  Добавить материал
                </Button>
              </div>
            </div>

            <div className="flex gap-6">
              <Card className="w-64 flex-shrink-0">
                <CardHeader>
                  <CardTitle className="text-sm">Категории</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === 'all' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Icon name="Layers" size={18} />
                    <span className="text-sm font-medium">Все материалы</span>
                    <Badge variant="outline" className="ml-auto">{materials.length}</Badge>
                  </button>
                  {(['metal', 'wood', 'plastic', 'electronics', 'consumables'] as MaterialCategory[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                      }`}
                    >
                      <Icon name={getCategoryIcon(cat)} size={18} />
                      <span className="text-sm font-medium">{getCategoryName(cat)}</span>
                      <Badge variant="outline" className="ml-auto">
                        {materials.filter(m => m.category === cat).length}
                      </Badge>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card className="flex-1">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Input placeholder="Поиск по названию, артикулу или баркоду..." className="max-w-md" />
                    <Button variant="outline" size="icon">
                      <Icon name="Search" size={20} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Материал</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Артикул</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Ед. изм.</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Доступно</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Резерв</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Всего</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Статус</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMaterials.map((material) => {
                          const available = material.totalStock - material.reserved;
                          const stockStatus = getStockStatus(material);
                          return (
                            <tr key={material.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                    <Icon name={getCategoryIcon(material.category)} size={16} className="text-gray-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{material.name}</p>
                                    <p className="text-xs text-gray-500">{getCategoryName(material.category)}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">{material.article}</td>
                              <td className="py-3 px-4 text-sm text-gray-600 text-center">{material.unit}</td>
                              <td className="py-3 px-4 text-sm font-medium text-right">{available}</td>
                              <td className="py-3 px-4 text-sm text-gray-600 text-right">{material.reserved}</td>
                              <td className="py-3 px-4 text-sm font-bold text-right">{material.totalStock}</td>
                              <td className="py-3 px-4 text-center">
                                <Icon name={stockStatus.icon} size={20} className={`mx-auto ${stockStatus.color}`} />
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center justify-center gap-1">
                                  <Button variant="ghost" size="icon">
                                    <Icon name="Eye" size={16} />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Icon name="Edit" size={16} />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeSection === 'warehouse' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Склад</h2>
                <p className="text-gray-500 mt-1">Складской учёт и операции</p>
              </div>
              <div className="flex gap-2">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Icon name="PackagePlus" size={20} className="mr-2" />
                  Приход материала
                </Button>
                <Button variant="outline">
                  <Icon name="ArrowRightLeft" size={20} className="mr-2" />
                  Перемещение
                </Button>
                <Button variant="outline">
                  <Icon name="PackageMinus" size={20} className="mr-2" />
                  Отпуск на проект
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Остатки на складе: Основной склад</CardTitle>
                  <Button variant="outline" size="sm">
                    <Icon name="Filter" size={16} className="mr-2" />
                    Фильтры
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Материал</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Доступно</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Резерв</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Всего</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Мин. остаток</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Статус</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materials.map((material) => {
                        const available = material.totalStock - material.reserved;
                        const stockStatus = getStockStatus(material);
                        return (
                          <tr key={material.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium text-gray-900">{material.name}</p>
                                <p className="text-xs text-gray-500">Артикул: {material.article}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-right">
                                <p className={`font-medium ${stockStatus.color}`}>{available} {material.unit}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600 text-right">{material.reserved} {material.unit}</td>
                            <td className="py-3 px-4 text-sm font-bold text-right">{material.totalStock} {material.unit}</td>
                            <td className="py-3 px-4 text-sm text-gray-600 text-center">{material.minStock} {material.unit}</td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Icon name={stockStatus.icon} size={18} className={stockStatus.color} />
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center gap-1">
                                <Button variant="outline" size="sm">
                                  <Icon name="Plus" size={14} className="mr-1" />
                                  Приход
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Icon name="Minus" size={14} className="mr-1" />
                                  Отпуск
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'reports' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Отчёты</h2>
                <p className="text-gray-500 mt-1">Анализ дефицита и движения материалов</p>
              </div>
              <Button variant="outline">
                <Icon name="Download" size={20} className="mr-2" />
                Экспорт в Excel
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="AlertTriangle" className="text-red-600" size={24} />
                  Отчёт по дефициту материалов
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Материал</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Категория</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Требуется (мин.)</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Доступно</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Нехватка</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Критичность</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {criticalMaterials.map((material) => {
                        const available = material.totalStock - material.reserved;
                        const shortage = material.minStock - available;
                        const criticalLevel = (shortage / material.minStock) * 100;
                        return (
                          <tr key={material.id} className="border-b border-gray-100 hover:bg-red-50 transition-colors">
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium text-gray-900">{material.name}</p>
                                <p className="text-xs text-gray-500">Артикул: {material.article}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">{getCategoryName(material.category)}</td>
                            <td className="py-3 px-4 text-sm font-medium text-right">{material.minStock} {material.unit}</td>
                            <td className="py-3 px-4 text-sm text-red-600 text-right font-medium">{available} {material.unit}</td>
                            <td className="py-3 px-4 text-sm text-red-600 text-right font-bold">{shortage} {material.unit}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center">
                                <Badge variant="destructive">
                                  {criticalLevel > 50 ? 'КРИТИЧНО' : 'Низкий'}
                                </Badge>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center gap-1">
                                <Button variant="outline" size="sm">
                                  <Icon name="ShoppingCart" size={14} className="mr-1" />
                                  Заказать
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {criticalMaterials.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-12 text-center">
                            <Icon name="CheckCircle2" size={48} className="mx-auto mb-2 text-green-500" />
                            <p className="text-gray-500">Все материалы в норме. Дефицитов не обнаружено.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Настройки</h2>
              <p className="text-gray-500 mt-1">Конфигурация системы и параметры</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Общие настройки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Уведомления о дефиците</p>
                    <p className="text-sm text-gray-500">Отправлять email при критичных остатках</p>
                  </div>
                  <Button variant="outline" size="sm">Включено</Button>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Автоматическое резервирование</p>
                    <p className="text-sm text-gray-500">При создании проекта резервировать материалы</p>
                  </div>
                  <Button variant="outline" size="sm">Включено</Button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">Баркод-сканирование</p>
                    <p className="text-sm text-gray-500">Использовать сканер для операций</p>
                  </div>
                  <Button variant="outline" size="sm">Выключено</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="Briefcase" size={24} className="text-blue-600" />
              Создать новый проект
            </DialogTitle>
            <DialogDescription>
              Заполните информацию о новом производственном проекте
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Название проекта *</Label>
              <Input
                id="project-name"
                placeholder="Например: Производство серии А-200"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-status">Статус</Label>
              <Select
                value={newProject.status}
                onValueChange={(value: ProjectStatus) => setNewProject({ ...newProject, status: value })}
              >
                <SelectTrigger id="project-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Планирование</SelectItem>
                  <SelectItem value="active">Активен</SelectItem>
                  <SelectItem value="completed">Завершён</SelectItem>
                  <SelectItem value="closed">Закрыт</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-deadline">Дедлайн *</Label>
              <Input
                id="project-deadline"
                type="date"
                value={newProject.deadline}
                onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-responsible">Ответственный *</Label>
              <Input
                id="project-responsible"
                placeholder="ФИО ответственного"
                value={newProject.responsible}
                onChange={(e) => setNewProject({ ...newProject, responsible: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateProjectOpen(false)}>
              Отмена
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateProject}>
              <Icon name="Plus" size={16} className="mr-2" />
              Создать проект
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;